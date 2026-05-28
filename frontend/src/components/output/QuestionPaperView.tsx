"use client";

import { DifficultyBadge } from "./DifficultyBadge";
import type { QuestionPaper } from "@/types";

interface QuestionPaperViewProps {
  paper: QuestionPaper;
}

export function QuestionPaperView({ paper }: QuestionPaperViewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden print:shadow-none print:border-0">
      <div className="p-8 md:p-12 max-w-3xl mx-auto" id="question-paper">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            {paper.schoolName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Subject: {paper.subject}</p>
          <p className="text-sm text-gray-600">Class: {paper.className}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-600 mb-4 gap-1">
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.maximumMarks}</span>
        </div>

        <p className="text-sm text-gray-600 mb-6 italic">
          General Instructions: {paper.generalInstructions}
        </p>

        {/* Student info */}
        <div className="space-y-3 mb-8 text-sm">
          <div className="flex gap-2">
            <span className="font-medium shrink-0">Name:</span>
            <span className="flex-1 border-b border-gray-300 border-dashed" />
          </div>
          <div className="flex gap-2">
            <span className="font-medium shrink-0">Roll Number:</span>
            <span className="flex-1 border-b border-gray-300 border-dashed" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="font-medium shrink-0">
              Class: {paper.className}
            </span>
            <span className="font-medium shrink-0">Section:</span>
            <span className="flex-1 min-w-[120px] border-b border-gray-300 border-dashed" />
          </div>
        </div>

        {/* Sections */}
        {paper.sections.map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-center font-bold text-base mb-2">
              {section.title}
            </h2>
            <p className="text-center text-sm italic text-gray-600 mb-4 whitespace-pre-line">
              {section.instruction}
            </p>
            <ol className="space-y-4 list-none">
              {section.questions.map((q) => (
                <li key={q.number} className="text-sm leading-relaxed">
                  <div className="flex flex-wrap items-start gap-2">
                    <span className="font-semibold shrink-0">{q.number}.</span>
                    <DifficultyBadge difficulty={q.difficulty} />
                    <span className="flex-1 min-w-0">{q.text}</span>
                    <span className="text-gray-500 shrink-0 whitespace-nowrap">
                      [{q.marks} Mark{q.marks > 1 ? "s" : ""}]
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <p className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
          End of Question Paper
        </p>
      </div>

      {/* Answer Key */}
      {paper.answerKey.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-8 md:p-12">
          <h3 className="text-center font-bold text-base mb-6">Answer Key</h3>
          <ol className="space-y-3 max-w-3xl mx-auto">
            {paper.answerKey.map((item) => (
              <li key={item.questionNumber} className="text-sm">
                <span className="font-semibold">{item.questionNumber}. </span>
                {item.answer}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
