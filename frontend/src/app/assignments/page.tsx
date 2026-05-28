"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState } from "@/components/assignments/EmptyState";
import { AssignmentCard } from "@/components/assignments/AssignmentCard";
import { api } from "@/lib/api";
import type { Assignment } from "@/types";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api
      .getAssignments()
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && a.status === "completed") ||
        (filter === "processing" &&
          (a.status === "processing" || a.status === "queued"));
      return matchesSearch && matchesFilter;
    });
  }, [assignments, search, filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    try {
      await api.deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout
      title="Assignments"
      assignmentCount={assignments.length}
      showFab={assignments.length > 0}
    >
      <div className="px-4 lg:px-8 py-6">
        {assignments.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-6 hidden lg:block">
              Create and manage class assignments.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none hidden sm:block" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-3 sm:pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white w-full sm:w-auto"
                >
                  <option value="all">Filter By</option>
                  <option value="completed">Completed</option>
                  <option value="processing">In Progress</option>
                </select>
              </div>
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Assignment"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                />
              </div>
            </div>
          </>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : assignments.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No matching assignments</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <AssignmentCard
                key={a._id}
                assignment={a}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {assignments.length > 0 && (
          <div className="hidden lg:flex justify-center mt-10">
            <Link
              href="/assignments/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-full text-sm font-medium hover:bg-gray-800 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create Assignment
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
