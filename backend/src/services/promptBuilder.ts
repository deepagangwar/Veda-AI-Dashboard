import type { CreateAssignmentInput } from "../types";

export function buildGenerationPrompt(input: CreateAssignmentInput): string {
  const questionSpec = input.questionTypes
    .map(
      (qt) =>
        `- ${qt.type}: ${qt.count} questions, ${qt.marksPerQuestion} marks each`
    )
    .join("\n");

  const totalQuestions = input.questionTypes.reduce((s, q) => s + q.count, 0);
  const totalMarks = input.questionTypes.reduce(
    (s, q) => s + q.count * q.marksPerQuestion,
    0
  );

  return `Create a structured exam question paper.

Specifications:

DUE DATE: ${input.dueDate}
TOTAL QUESTIONS: ${totalQuestions}
TOTAL MARKS: ${totalMarks}

QUESTION TYPE BREAKDOWN:
${questionSpec}

${input.additionalInstructions ? `ADDITIONAL INSTRUCTIONS:\n${input.additionalInstructions}` : ""}
${input.fileContent ? `REFERENCE CONTENT FROM UPLOADED FILE:\n${input.fileContent.slice(0, 3000)}` : ""}

Return ONLY valid JSON matching this exact schema (no markdown, no explanation):
{
  "schoolName": "string",
  "subject": "string",
  "className": "string",
  "timeAllowed": "string (e.g. 45 minutes)",
  "maximumMarks": number,
  "generalInstructions": "string",
  "aiMessage": "string - one line summary for the teacher",
  "sections": [
    {
      "id": "section-a",
      "title": "Section A",
      "instruction": "string",
      "questions": [
        {
          "number": 1,
          "text": "question text",
          "difficulty": "easy" | "moderate" | "hard",
          "marks": number
        }
      ]
    }
  ],
  "answerKey": [
    { "questionNumber": 1, "answer": "detailed answer" }
  ]
}

Rules:
- Group questions by type into sections (Section A, B, etc.)
- Distribute difficulty: ~40% easy, ~40% moderate, ~20% hard
- Each question must have accurate marks matching the spec
- Questions must be curriculum-appropriate and unique
- Answer key must cover every question`;
}
