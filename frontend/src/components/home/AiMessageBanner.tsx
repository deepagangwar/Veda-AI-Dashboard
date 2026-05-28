"use client";

import { Download } from "lucide-react";

interface AiMessageBannerProps {
  message: string;
  pdfHref?: string;
}

export function AiMessageBanner({ message, pdfHref }: AiMessageBannerProps) {
  return (
    <div className="bg-[#2d2d2d] text-white rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
      <p className="text-sm md:text-[15px] leading-relaxed flex-1">{message}</p>
      {pdfHref ? (
        <a
          href={pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-sm font-medium shrink-0 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download as PDF
        </a>
      ) : (
        <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm font-medium shrink-0 opacity-80 cursor-default">
          <Download className="w-4 h-4" />
          Download as PDF
        </span>
      )}
    </div>
  );
}
