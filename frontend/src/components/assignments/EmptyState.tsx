"use client";

import Link from "next/link";
import { FileSearch } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
          <FileSearch className="w-16 h-16 text-gray-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-500 font-bold text-xl">✕</span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        No assignments yet
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Create an assignment to build a question paper for your class.
      </p>

      <Link
        href="/assignments/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Create assignment
      </Link>
    </div>
  );
}
