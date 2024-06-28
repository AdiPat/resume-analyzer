function extractUploadIdFromS3Key(path: string): string | null {
  const match = path.match(/^resumes\/([^_]+)_/);
  return match ? match[1] : null;
}

export { extractUploadIdFromS3Key };
