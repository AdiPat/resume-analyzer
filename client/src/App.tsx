import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { uploadFile } from "./api";
import { cache } from "./common";
import { Link } from "react-router-dom";
import { Image } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faDatabase } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const inputFile = useRef(null);

  useEffect(() => {
    document.title = "Resume Analyzer";
  }, []);

  const handleUploadClick = (): void => {
    if (inputFile.current) {
      const input = inputFile.current as HTMLInputElement;
      input.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      const uploadId = await uploadFile(file);

      if (!uploadId) {
        setSuccessMessage(null);
        setError("Failed to upload file. Try again. ");
        return;
      }

      setError(null);
      setSuccessMessage(
        `File uploaded successfully. UploadID: ${uploadId}. Save the upload ID somewhere!`
      );
      console.log("Uploaded file with upload ID:", uploadId);

      const key = `uploads_${uploadId}`;

      cache.set(key, { uploadId, filename: file.name });
    }
  };

  return (
    <div className="home-container border border-gray-400 bg-gray-800 rounded-lg flex flex-col p-8 my-32 mx-auto mx-4">
      <div className="flex justify-between items-center">
        <Image className="mr-8" src="/logo.png" width={300} height={300} />
        <div className="ml-4">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            Resume Analyzer 📈
          </h1>
          <p className="text-white mb-4">
            Optimize Your Resume. Achieve Your Dream Job. ✅
          </p>
          <p className="text-white">
            In today's competitive job market, your resume is your first
            impression. Make it count with Resume Analyzer, your go-to tool for
            analyzing and optimizing your resume.
            <br /> Unlock your potential and get noticed by recruiters with our
            comprehensive, user-friendly resume analysis.
          </p>

          <div className="home-controls md:flex sm:flex sm:flex-col gap-4 mt-6 justify-center">
            <Button
              color="primary"
              size="lg"
              onClick={handleUploadClick}
              className="upload-button mx-auto"
              startContent={<FontAwesomeIcon icon={faFile} />}
            >
              Upload Resume
              <input
                onChange={handleFileChange}
                className="hidden"
                type="file"
                id="file"
                ref={inputFile}
              />
            </Button>
            <Link to={"/uploads"} className="view-button no-underline">
              <Button
                color="primary"
                size="lg"
                style={{ width: "100%" }}
                startContent={<FontAwesomeIcon icon={faDatabase} />}
              >
                View Analyzed Resumes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white mt-4 rounded-lg">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg text-center font-bold">
            {error}
          </div>
        )}
      </div>
      <div>
        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg text-center font-bold mt-4">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
