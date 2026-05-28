"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Mic, ArrowLeft, ArrowRight } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FileUpload } from "@/components/form/FileUpload";
import { QuestionTypeRowComponent } from "@/components/form/QuestionTypeRow";
import { useAssignmentFormStore } from "@/store/assignmentFormStore";
import { api } from "@/lib/api";

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    dueDate,
    questionTypes,
    additionalInstructions,
    file,
    errors,
    setDueDate,
    addQuestionType,
    removeQuestionType,
    updateQuestionType,
    setAdditionalInstructions,
    setFile,
    validate,
    getTotals,
  } = useAssignmentFormStore();

  const totals = getTotals();

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          dueDate,
          questionTypes: questionTypes.map(({ type, count, marksPerQuestion }) => ({
            type,
            count,
            marksPerQuestion,
          })),
          additionalInstructions: additionalInstructions || undefined,
        })
      );
      if (file) formData.append("file", file);

      const assignment = await api.createAssignment(formData);
      router.push(`/assignments/${assignment._id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Assignment" showBack showFab={false}>
      <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div className="h-full w-1/2 bg-brand-orange transition-all" />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-xl font-semibold mb-1">Create Assignment</h1>
            <p className="text-sm text-gray-500 mb-8">
              Add due date, question types, and optional notes.
            </p>

            <section className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Assignment Details
              </h2>

              <div className="space-y-6">
                <FileUpload file={file} onFileChange={setFile} />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  {errors.dueDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>
                  )}
                </div>

                <div>
                  <div className="hidden md:grid md:grid-cols-[1fr_140px_120px_40px] gap-4 mb-2">
                    <span className="text-xs text-gray-500">Question Type</span>
                    <span className="text-xs text-gray-500">No. of Questions</span>
                    <span className="text-xs text-gray-500">Marks</span>
                    <span />
                  </div>

                  <div className="space-y-4 md:space-y-0">
                    {questionTypes.map((row, i) => (
                      <QuestionTypeRowComponent
                        key={row.id}
                        row={row}
                        index={i}
                        onUpdate={updateQuestionType}
                        onRemove={removeQuestionType}
                        canRemove={questionTypes.length > 1}
                        errors={errors}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addQuestionType}
                    className="mt-4 text-sm text-brand-orange font-medium hover:underline"
                  >
                    + Add Question Type
                  </button>

                  <div className="mt-4 flex gap-6 text-sm text-gray-600 md:justify-end">
                    <span>
                      Total Questions:{" "}
                      <strong className="text-gray-900">{totals.questions}</strong>
                    </span>
                    <span>
                      Total Marks:{" "}
                      <strong className="text-gray-900">{totals.marks}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Information
                  </label>
                  <div className="relative">
                    <textarea
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      placeholder="Optional notes for generation"
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                    />
                    <Mic className="w-4 h-4 text-gray-300 absolute bottom-3 right-3" />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
