import { useEffect, useState } from "react";
import { cache } from "../common";
import { Input } from "@nextui-org/react";
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
        Click to view analyzed resumes.
      </p>
      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        labelPlacement="outside"
        startContent={<FontAwesomeIcon icon={faSearch} />}
        onValueChange={setSearchQuery}
        className="mb-8"
      />
      <div className="flex flex-col mt-4 gap-4">
        {uploads.map((upload, idx) => (
          <div
            className="p-2 mb-4 bg-orange-400 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-200 transform hover:scale-105"
            key={upload.uploadId}
          >
            <span className="mr-2">{idx + 1}</span>
            <span className="font-bold">{upload.filename} </span>
            <span className="ml-2">{`(${upload.uploadId})`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { UploadsPage };
