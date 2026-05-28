import { config } from "../config";
import type {
  CreateAssignmentInput,
  Difficulty,
  Question,
  QuestionPaper,
  QuestionSection,
} from "../types";

const QUESTION_BANK: Record<string, string[]> = {
  "Multiple Choice Questions": [
    "Which of the following is a good conductor of electricity?",
    "What is the SI unit of electric current?",
    "Which material is used for making fuse wire?",
    "The process of depositing a layer of metal on another metal is called?",
    "Which device converts electrical energy to mechanical energy?",
  ],
  "Short Questions": [
    "Define electroplating. Explain its purpose.",
    "State Ohm's law and write its mathematical expression.",
    "What is the difference between series and parallel circuits?",
    "Explain why copper is used for electrical wiring.",
    "Define resistance and state its SI unit.",
  ],
  "Diagram/Graph-Based Questions": [
    "Draw a labelled diagram of an electric circuit with a battery, switch, and bulb.",
    "Plot voltage versus current for an ohmic conductor.",
    "Draw magnetic field lines around a current-carrying straight conductor.",
    "Sketch a circuit for measuring resistance using ammeter and voltmeter.",
  ],
  "Numerical Problems": [
    "Calculate resistance when 2A flows at 12V.",
    "Find total resistance for 4Ω and 6Ω in series.",
    "A 100W bulb runs at 220V. Find the current.",
    "Calculate heat produced in 5 minutes by a 1000W heater.",
  ],
};

function pickDifficulty(index: number): Difficulty {
  if (index % 5 === 0) return "hard";
  if (index % 3 === 0) return "moderate";
  return "easy";
}

function buildQuestions(
  type: string,
  count: number,
  marks: number,
  start: number
): Question[] {
  const pool = QUESTION_BANK[type] || QUESTION_BANK["Short Questions"];
  return Array.from({ length: count }, (_, i) => ({
    number: start + i,
    text: pool[i % pool.length],
    difficulty: pickDifficulty(start + i),
    marks,
  }));
}

export function generateLocalQuestionPaper(
  input: CreateAssignmentInput
): QuestionPaper {
  const sections: QuestionSection[] = [];
  const answerKey: { questionNumber: number; answer: string }[] = [];
  let num = 1;
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  input.questionTypes.forEach((qt, idx) => {
    const questions = buildQuestions(
      qt.type,
      qt.count,
      qt.marksPerQuestion,
      num
    );

    questions.forEach((q) => {
      answerKey.push({
        questionNumber: q.number,
        answer: `Answer for Q${q.number} to be reviewed by the teacher.`,
      });
    });

    sections.push({
      id: `section-${labels[idx].toLowerCase()}`,
      title: `Section ${labels[idx]}`,
      instruction: `Answer all questions. Each carries ${qt.marksPerQuestion} mark${qt.marksPerQuestion > 1 ? "s" : ""}.`,
      questions,
    });

    num += qt.count;
  });

  const maximumMarks = input.questionTypes.reduce(
    (s, q) => s + q.count * q.marksPerQuestion,
    0
  );
  const totalQuestions = input.questionTypes.reduce((s, q) => s + q.count, 0);
  const minutes = Math.max(30, totalQuestions * 3);
  const school =
    config.schoolName.trim() || "School Name";
  const subject = config.subject.trim() || "General";
  const grade = config.className.trim() || "—";

  return {
    schoolName: school,
    subject,
    className: grade,
    timeAllowed: `${minutes} minutes`,
    maximumMarks,
    generalInstructions:
      "All questions are compulsory unless stated otherwise.",
    aiMessage: `${subject}, Class ${grade} — ${totalQuestions} questions, ${maximumMarks} marks total.`,
    sections,
    answerKey,
  };
}
