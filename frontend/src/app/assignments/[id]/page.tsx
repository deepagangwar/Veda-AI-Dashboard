"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, RefreshCw, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QuestionPaperView } from "@/components/output/QuestionPaperView";
import { GenerationProgress } from "@/components/output/GenerationProgress";
import { api } from "@/lib/api";
import { subscribeToAssignment } from "@/lib/socket";
import type { Assignment, JobProgress, QuestionPaper } from "@/types";

export default function AssignmentOutputPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchAssignment = useCallback(async () => {
    try {
      const data = await api.getAssignment(id);
      setAssignment(data);
      if (data.questionPaper) setPaper(data.questionPaper);
    } catch {
      router.push("/assignments");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToAssignment(id, (data) => {
      setProgress(data);
      if (data.status === "completed") {
        fetchAssignment();
      }
    });

    return unsubscribe;
  }, [id, fetchAssignment]);

  useEffect(() => {
    if (
      assignment &&
      (assignment.status === "queued" || assignment.status === "processing")
    ) {
      const interval = setInterval(async () => {
        const status = await api.getStatus(id);
        if (status.status === "completed") {
          fetchAssignment();
          clearInterval(interval);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [assignment, id, fetchAssignment]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    setPaper(null);
    setProgress({ assignmentId: id, status: "queued", progress: 0, message: "Queued..." });
    try {
      await api.regenerate(id);
      setAssignment((a) => (a ? { ...a, status: "queued" } : a));
    } catch (err) {
      console.error(err);
    } finally {
      setRegenerating(false);
    }
  };

  const isGenerating =
    assignment?.status === "queued" ||
    assignment?.status === "processing" ||
    regenerating;

  if (loading) {
    return (
      <DashboardLayout title="Create New" showBack showFab={false}>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create New" showBack showFab={false}>
      <div className="px-4 lg:px-8 py-6 max-w-4xl mx-auto">
        {/* Action bar */}
        {paper && !isGenerating && (
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => router.push("/assignments")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm hover:bg-white"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </button>
            <a
              href={api.getPdfUrl(id)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-brand-dark text-white rounded-full text-sm hover:bg-gray-800 ml-auto"
            >
              <Download className="w-4 h-4" />
              Download as PDF
            </a>
          </div>
        )}

        {isGenerating ? (
          <GenerationProgress
            progress={progress?.progress ?? 10}
            message={
              progress?.message ?? "Your question paper is being generated..."
            }
          />
        ) : paper ? (
          <>
            {paper.aiMessage && (
              <div className="bg-brand-dark text-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-sm flex-1 leading-relaxed">{paper.aiMessage}</p>
                <a
                  href={api.getPdfUrl(id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm shrink-0 border border-white/20"
                >
                  <Download className="w-4 h-4" />
                  Download as PDF
                </a>
              </div>
            )}
            <QuestionPaperView paper={paper} />
          </>
        ) : assignment?.status === "failed" ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">Generation failed. Please try again.</p>
            <button
              onClick={handleRegenerate}
              className="px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm"
            >
              Retry Generation
            </button>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
