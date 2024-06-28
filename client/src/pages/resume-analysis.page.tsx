import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAnalysis } from "../api";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  formatText,
  splitIntoParagraphs,
  capitalizeFirstLetter,
} from "../common";

function ResumeAnalysisPage() {
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [message, setMessage] = useState("");

  const { uploadId } = useParams();

  useEffect(() => {
    document.title = "AI Resume Analysis";

    if (uploadId) {
      getAnalysis({ uploadId: uploadId })
        .then((analysis) => {
          console.log({ analysis });
          if (analysis.error) {
            setMessage("Resume Analysis is not ready. Please try again later.");
            setResumeAnalysis(null);
          } else {
            setMessage("");
            setResumeAnalysis(analysis);
          }
        })
        .catch((err) => {
          console.error("failed to get analysis", err);
        });
    }
  }, [uploadId]);

  return (
    <div
      className="flex flex-col bg-gray-800 rounded-lg p-8 m-8 mx-auto"
      style={{ width: "80%" }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white text-center">
        Resume: {uploadId}
      </h1>

      {message ? (
        <div className="bg-orange-200 border rounded-lg p-8 mb-4">
          <span className="block sm:inline">{message}</span>
        </div>
      ) : (
        <p className="text-white text-center mb-4">
          Here is a detailed analysis of your resume!
        </p>
      )}

      {resumeAnalysis && (
        <div className="flex w-full flex-col">
          <Tabs aria-label="Options">
            {Object.keys(resumeAnalysis).map((key) => {
              if (["id", "uploadId"].includes(key)) return null;
              return (
                <Tab key={key} title={capitalizeFirstLetter(key)}>
                  <Card>
                    <CardBody className="p-8">
                      <h2 className="text-xl font-bold uppercase mb-8">
                        Report: {capitalizeFirstLetter(key)}
                      </h2>

                      <div className="flex flex-col gap-4">
                        <div className="flex justify-center mb-8">
                          <div style={{ width: 200, height: 200 }}>
                            <CircularProgressbar
                              value={(resumeAnalysis[key] as any).score * 20}
                              text={`${(resumeAnalysis[key] as any).score}`}
                            />
                          </div>
                        </div>

                        {splitIntoParagraphs(
                          formatText((resumeAnalysis[key] as any).description)
                        ).map((paragraph, idx) => (
                          <p key={idx} className="text-lg text-gray-800">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </Tab>
              );
            })}
          </Tabs>
        </div>
      )}
    </div>
  );
}

export { ResumeAnalysisPage };
