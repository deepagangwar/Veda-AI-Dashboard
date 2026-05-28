import PDFDocument from "pdfkit";
import type { QuestionPaper } from "../types";

function difficultyLabel(d: string): string {
  const map: Record<string, string> = {
    easy: "Easy",
    moderate: "Moderate",
    hard: "Challenging",
  };
  return map[d] || d;
}

export function generateQuestionPaperPdf(paper: QuestionPaper): PDFKit.PDFDocument {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  doc.fontSize(16).text(paper.schoolName, { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(12).text(`Subject: ${paper.subject}`, { align: "center" });
  doc.text(`Class: ${paper.className}`, { align: "center" });
  doc.moveDown();

  doc.fontSize(10);
  doc.text(`Time Allowed: ${paper.timeAllowed}`, { continued: true });
  doc.text(`Maximum Marks: ${paper.maximumMarks}`, { align: "right" });
  doc.moveDown();

  doc.text(`General Instructions: ${paper.generalInstructions}`);
  doc.moveDown();

  doc.text("Name: _________________________");
  doc.text("Roll Number: _________________________");
  doc.text(`Class: ${paper.className}   Section: _________________________`);
  doc.moveDown();

  paper.sections.forEach((section) => {
    doc.fontSize(14).text(section.title, { align: "center", underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica-Oblique").text(section.instruction);
    doc.font("Helvetica");
    doc.moveDown(0.5);

    section.questions.forEach((q) => {
      doc
        .fontSize(11)
        .text(
          `${q.number}. [${difficultyLabel(q.difficulty)}] ${q.text} [${q.marks} Mark${q.marks > 1 ? "s" : ""}]`,
          { lineGap: 4 }
        );
    });
    doc.moveDown();
  });

  doc.fontSize(12).text("End of Question Paper", { align: "center" });
  doc.addPage();
  doc.fontSize(14).text("Answer Key", { align: "center", underline: true });
  doc.moveDown();

  paper.answerKey.forEach((item) => {
    doc.fontSize(10).text(`${item.questionNumber}. ${item.answer}`, {
      lineGap: 3,
    });
  });

  doc.end();
  return doc;
}
