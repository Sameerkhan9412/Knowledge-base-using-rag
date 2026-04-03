import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractTextFromPDF = async (filePath) => {
  try {
    console.log("Extracting text...");

    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");

      text += pageText + "\n";
    }

    console.log("Extraction done");

    return text;

  } catch (error) {
    console.error("PDF extract error:", error);
    return "";
  }
};