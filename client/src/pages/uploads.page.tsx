import { useEffect, useState } from "react";
import { cache } from "../common";
import { Button, Input, Link } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Upload {
  uploadId: string;
  filename: string;
}

function UploadsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    document.title = "Resume Analyzer: Uploads";

    const loadUploads = async () => {
      const allKeys = await cache.getAllKeys();
      const uploadKeys = allKeys.filter((key) => key.startsWith("uploads_"));
      let uploads = await Promise.all(
        uploadKeys.map(async (key) => {
          const data = await cache.get(key);
          return data;
        })
      );

      if (searchQuery) {
        uploads = uploads.filter(
          (upload) =>
            upload.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            upload.uploadId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setUploads(uploads);
    };

    loadUploads();
  }, [searchQuery]);

  return (
    <div
      className="flex flex-col bg-gray-800 rounded-lg p-8 m-8 mx-auto"
      style={{ width: "80%" }}
    >
      <h1 className="text-4xl font-bold mb-4 text-white text-center">
        Uploads
      </h1>
      <p className="text-white text-center mb-4">
        All your analyzed resumes in one place.
      </p>
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        labelPlacement="outside"
        startContent={<FontAwesomeIcon icon={faSearch} />}
        onValueChange={setSearchQuery}
        className="mb-8"
        size="lg"
      />
      <div className="flex flex-col mt-4 gap-4 justify-center items-center">
        {uploads.map((upload, idx) => (
          <div
            className="flex p-4 mb-4 bg-gray-300 rounded-lg cursor-pointer items-center"
            key={upload.uploadId}
            style={{ width: "75%" }}
          >
            <div>
              <span className="mr-2">{idx + 1}</span>
              <span className="font-bold">{upload.filename} </span>
              <span className="ml-2">{`(${upload.uploadId})`}</span>
            </div>
            <Link className="ml-auto" href={`/resumes/${upload.uploadId}`}>
              <Button size="md" color="primary">
                View Analysis
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export { UploadsPage };
