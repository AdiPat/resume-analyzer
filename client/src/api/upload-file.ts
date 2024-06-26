import { ID } from "../models";

interface UploadFileResponse {
  uploadId: string;
  error?: string;
}

/**
 * Uploads a file and returns the upload ID.
 * @param file File
 * @returns string uploadId of the file
 */
async function uploadFile(file: File): Promise<ID | null> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/resume/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json() as unknown as UploadFileResponse)
    .catch((err) => {
      console.error("failed to upload file", err);
      return null;
    });

  const uploadId = response?.uploadId;

  if (!uploadId) {
    return null;
  }

  return uploadId;
}

export type { UploadFileResponse };

export { uploadFile };
