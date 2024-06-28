/**
 * Get analysis of resume
 * @param uploadId - The upload ID of the resume
 * @returns The analysis of the resume
 *
 */

async function getAnalysis({ uploadId }: { uploadId: string }) {
  const response = await fetch(
    `${process.env.REACT_APP_API_BASE_URL}/resume/analysis/${uploadId}`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error("failed to get analysis", err);
      return null;
    });

  return response;
}

export { getAnalysis };
