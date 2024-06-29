import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getAnalysis, getResumeFilename } from "../api";
import { Tabs, Tab, Card, CardBody, Chip } from "@nextui-org/react";
import { CircularProgressbar } from "react-circular-progressbar";
import {
  formatText,
  splitIntoParagraphs,
  capitalizeFirstLetter,
  splitTextIntoTwoLineEntries,
} from "../common";

function ResumeAnalysisPage() {
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [message, setMessage] = useState("");

  const { uploadId } = useParams();

  const [fileName, setFilename] = useState(uploadId);

  useEffect(() => {
    if (uploadId) {
      getResumeFilename(uploadId).then((filename: string) => {
        console.log({ filename });
        setFilename(filename);
      });
    }
  }, [uploadId]);

  useEffect(() => {
    document.title = "AI Resume Analysis";

    if (uploadId) {
      getAnalysis({ uploadId: uploadId })
        .then((analysis) => {
          console.log({ analysis });
          if (!analysis || analysis.error) {
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
      <h1 className="text-2xl font-bold mb-4 text-white text-center">
        {fileName}
      </h1>
      <h2 className="text-white text-center mb-8">Upload ID: {uploadId}</h2>

      {message && (
        <div className="bg-orange-200 border rounded-lg p-8 mb-4">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {resumeAnalysis && (
        <div className="flex w-full flex-col">
          <div className="flex gap-4 bg-gray-100 my-6 p-8 rounded-lg items-center">
            <h2
              className="text-sm font-bold mb-4 uppercase"
              style={{ width: "50%" }}
            >
              Recommended Jobs:{" "}
            </h2>
            <p>
              {(resumeAnalysis as any)?.recommendedJobs.map((job: string) => (
                <Chip className="mx-2 my-1" color="primary">
                  {job}
                </Chip>
              ))}
            </p>
          </div>
          <Tabs aria-label="Options">
            {Object.keys(resumeAnalysis).map((key) => {
              if (["id", "uploadId", "recommendedJobs"].includes(key))
                return null;
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

                        <ul className="list-disc list-inside">
                          {splitTextIntoTwoLineEntries(
                            formatText((resumeAnalysis[key] as any).description)
                          ).map((paragraph, idx) => (
                            <li
                              key={idx}
                              className="text-lg text-gray-800 mb-2"
                            >
                              {paragraph}
                            </li>
                          ))}
                        </ul>
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
