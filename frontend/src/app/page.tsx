"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AiMessageBanner } from "@/components/home/AiMessageBanner";
import { QuestionPaperView } from "@/components/output/QuestionPaperView";
import { GenerationProgress } from "@/components/output/GenerationProgress";
import { api } from "@/lib/api";
import type { Assignment, QuestionPaper } from "@/types";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [latestId, setLatestId] = useState<string | null>(null);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [processing, setProcessing] = useState<Assignment | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const assignments = await api.getAssignments();
        setAssignmentCount(assignments.length);

        const inProgress = assignments.find(
          (a) => a.status === "queued" || a.status === "processing"
        );
        if (inProgress) {
          setProcessing(inProgress);
          setLoading(false);
          return;
        }

        const completed = assignments.find((a) => a.status === "completed");
        if (completed) {
          const full = await api.getAssignment(completed._id);
          if (full.questionPaper) {
            setPaper(full.questionPaper);
            setLatestId(completed._id);
          }
        }
      } catch {
        /* backend offline */
      }
      setLoading(false);
    }

    load();
  }, []);

  const pdfHref = latestId ? api.getPdfUrl(latestId) : undefined;

  return (
    <DashboardLayout
      showBack
      showCreateNew
      assignmentCount={assignmentCount}
      showFab={false}
      sidebarVariant="home"
    >
      <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : processing ? (
          <div className="space-y-6">
            <GenerationProgress
              progress={processing.status === "processing" ? 50 : 15}
              message="Generating question paper…"
            />
            <p className="text-center text-sm text-gray-500">
              <Link
                href={`/assignments/${processing._id}`}
                className="text-brand-orange hover:underline"
              >
                View status
              </Link>
            </p>
          </div>
        ) : paper ? (
          <>
            {paper.aiMessage && (
              <AiMessageBanner message={paper.aiMessage} pdfHref={pdfHref} />
            )}
            <QuestionPaperView paper={paper} />
            {latestId && (
              <div className="flex justify-center pt-2">
                <Link
                  href={`/assignments/${latestId}`}
                  className="text-sm text-brand-orange font-medium hover:underline"
                >
                  View assignment
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No papers yet
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Create an assignment to generate a question paper.
            </p>
            <Link
              href="/assignments/create"
              className="inline-flex px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Create assignment
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
