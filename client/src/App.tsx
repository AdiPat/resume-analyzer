import "./App.css";
import { useEffect, useRef } from "react";
import { Button } from "@nextui-org/button";

function App() {
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

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
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
          View Analyzed Resumes
        </Button>
      </div>
    </div>
  );
}

export default App;
