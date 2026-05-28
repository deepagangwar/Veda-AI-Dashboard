"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import type { Assignment } from "@/types";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
}

export function AssignmentCard({ assignment, onDelete }: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const dueDate = new Date(assignment.dueDate);
  const assignedDate = new Date(assignment.createdAt);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow relative group">
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 pr-2">
          {assignment.title}
        </h3>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 min-w-[160px]">
              <Link
                href={`/assignments/${assignment._id}`}
                className="block px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setMenuOpen(false)}
              >
                View Assignment
              </Link>
              <button
                onClick={() => {
                  onDelete(assignment._id);
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        <p>
          Assigned on{" "}
          <span className="text-gray-700">
            {format(assignedDate, "dd MMM yyyy")}
          </span>
        </p>
        <p>
          Due{" "}
          <span className="text-gray-700">
            {format(dueDate, "dd MMM yyyy")}
          </span>
        </p>
      </div>

      {assignment.status === "processing" && (
        <span className="inline-block mt-3 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
          Generating...
        </span>
      )}
      {assignment.status === "completed" && (
        <Link
          href={`/assignments/${assignment._id}`}
          className="block mt-3 text-xs text-brand-orange font-medium hover:underline"
        >
          View question paper →
        </Link>
      )}
    </div>
  );
}
