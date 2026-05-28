import OpenAI from "openai";
import { config } from "../config";
import type { CreateAssignmentInput, QuestionPaper } from "../types";
import { buildGenerationPrompt } from "./promptBuilder";
import { generateLocalQuestionPaper } from "./localGenerator";

const openai = config.openaiApiKey
  ? new OpenAI({ apiKey: config.openaiApiKey })
  : null;

function parseJsonResponse(content: string): QuestionPaper {
  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const parsed = JSON.parse(cleaned) as QuestionPaper;

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid response: missing sections");
  }

  return parsed;
}

export async function generateQuestionPaper(
  input: CreateAssignmentInput
): Promise<QuestionPaper> {
  if (!openai) {
    return generateLocalQuestionPaper(input);
  }

  const prompt = buildGenerationPrompt(input);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You generate structured exam papers. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI");

  return parseJsonResponse(content);
}
