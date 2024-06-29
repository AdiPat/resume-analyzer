import { LocalStorageCache } from "./local-storage-cache";
export type { Cache } from "./cache";
export { LocalStorageCache } from "./local-storage-cache";

const cache = new LocalStorageCache();

function capitalizeFirstLetter(s: string): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatText(text: string): string {
  if (!text) {
    return "";
  }
  const newText = text.replace(/\./g, ". ");
  return newText;
}

function splitIntoParagraphs(
  text: string,
  sentencesPerParagraph = 4
): string[] {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  let paragraphs = [];

  for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(" "));
  }

  return paragraphs;
}

function splitTextIntoTwoLineEntries(text: string): string[] {
  if (!text) {
    return [];
  }

  const lines = text.match(/[^.!?]+[.!?](\s|$)/g) || [];
  const result = [];

  for (let i = 0; i < lines.length; i += 2) {
    // Check if the next line exists to avoid undefined in the result
    if (lines[i + 1]) {
      result.push(`${lines[i]}\n${lines[i + 1].trim()}`);
    } else {
      // For the last line if it's alone
      result.push(lines[i].trim());
    }
  }

  return result;
}

export {
  cache,
  splitIntoParagraphs,
  splitTextIntoTwoLineEntries,
  capitalizeFirstLetter,
  formatText,
};
