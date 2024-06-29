/**
 * Gets the filename of the resume
 * @param uploadId The ID of the resume upload
 * @returns The filename of the resume
 *
 */

async function getResumeFilename(uploadId: string): Promise<string> {
  const response = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/resume/${uploadId}/filename`
  ).catch((err) => {
    console.error("Failed to get resume filename", err);
    return null;
  });

  if (!response) {
    return uploadId;
  }

  const data = await response.json();

  return data.fileName;
}

export { getResumeFilename };
