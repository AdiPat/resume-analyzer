import "./App.css";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { uploadFile } from "./api";
import { cache } from "./common";
import { Link } from "react-router-dom";

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

      cache.set(key, { uploadId, filename: File.name });
    }
  };

  return (
    <div
      className="border border-gray-400 bg-gray-800 rounded-lg flex flex-col p-8 my-32 mx-auto"
      style={{ width: "80%" }}
    >
      <h1 className="text-4xl font-bold text-white mb-4 text-center">
        Resume Analyzer 📈
      </h1>
      <p className="text-white mb-4 text-center">
        Resume Analyzer is a simple tool to analyze resumes. It gives you
        detailed insights on the content, structure, keywords, and various other
        parameters that you could leverage to optimize your resume. Run the
        analysis and then get back to the drawing board to optimize your resume.
      </p>
      <p className="text-white text-center">
        Crack your dream job by optimizing your resume with Resume Analyzer. ✅
      </p>
      <div className="flex gap-4 mt-4 justify-center">
        <Button color="primary" size="lg" onClick={handleUploadClick}>
          Upload Resume
          <input
            onChange={handleFileChange}
            className="hidden"
            type="file"
            id="file"
            ref={inputFile}
          />
        </Button>
        <Button color="primary" size="lg">
          <Link to={"/uploads"} className="no-underline">
            View Analyzed Resumes
          </Link>
        </Button>
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
