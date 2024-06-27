import { useParams } from "react-router";

function ResumePage() {
  const { uploadId } = useParams();

  return (
    <div
      className="flex flex-col bg-gray-800 rounded-lg p-8 m-8 mx-auto"
      style={{ width: "80%" }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white text-center">
        Resume: {uploadId}
      </h1>
      <p className="text-white text-center mb-4">
        Here is a detailed analysis of your resume!
      </p>
    </div>
  );
}

export { ResumePage };
