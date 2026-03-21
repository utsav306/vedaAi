import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { env } from "../config/env";
import { GeneratedPaper } from "../types/assignment";

function renderHtml(paper: GeneratedPaper): string {
  const sectionsHtml = paper.sections
    .map(
      (section) => `
      <section style="margin-top:24px;">
        <h2 style="font-size:20px;margin:0 0 8px 0;">${section.title}</h2>
        <p style="margin:0 0 12px 0;color:#555;">${section.instruction}</p>
        <ol style="padding-left:20px;line-height:1.6;">
          ${section.questions
            .map(
              (q) => `<li style="margin-bottom:10px;">
                <div>${q.text}</div>
                <div style="font-size:12px;color:#666;">Difficulty: ${q.difficulty} | Marks: ${q.marks}</div>
              </li>`,
            )
            .join("")}
        </ol>
      </section>
      `,
    )
    .join("");

  const fields = paper.studentInfoFields
    .map((field) => `<p style="margin:4px 0;">${field}: __________________</p>`)
    .join("");

  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>${paper.title}</title>
  </head>
  <body style="font-family:Arial,sans-serif;padding:28px;color:#1f1f1f;">
    <h1 style="margin:0 0 4px 0;">${paper.title}</h1>
    <p style="margin:0 0 2px 0;">Subject: ${paper.subject}</p>
    <p style="margin:0 0 20px 0;">Class: ${paper.className}</p>
    ${fields}
    ${sectionsHtml}
  </body>
  </html>`;
}

export async function generatePdfFromPaper(assignmentId: string, paper: GeneratedPaper): Promise<string> {
  const outDir = path.resolve(process.cwd(), env.PDF_OUTPUT_DIR);
  await mkdir(outDir, { recursive: true });
  const outputPath = path.join(outDir, `${assignmentId}.pdf`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(renderHtml(paper), { waitUntil: "networkidle" });
  await page.pdf({ path: outputPath, format: "A4", printBackground: true });
  await browser.close();

  return outputPath;
}
