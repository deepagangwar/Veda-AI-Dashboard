"use client";

import { X } from "lucide-react";
import { CounterInput } from "./CounterInput";
import { DEFAULT_TYPES } from "@/store/assignmentFormStore";
import type { QuestionTypeRow as Row } from "@/types";

interface Props {
  row: Row;
  index: number;
  onUpdate: (id: string, field: keyof Row, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  errors?: Record<string, string>;
}

export function QuestionTypeRowComponent({
  row,
  index,
  onUpdate,
  onRemove,
  canRemove,
  errors = {},
}: Props) {
  return (
    <>
      {/* Desktop table row */}
      <div className="hidden md:grid md:grid-cols-[1fr_140px_120px_40px] gap-4 items-end pb-4 border-b border-gray-100 last:border-0">
        <div>
          {index === 0 && (
            <label className="block text-xs text-gray-500 mb-1.5">
              Question Type
            </label>
          )}
          <select
            value={row.type}
            onChange={(e) => onUpdate(row.id, "type", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          >
            {DEFAULT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <CounterInput
          label={index === 0 ? "No. of Questions" : undefined}
          value={row.count}
          onChange={(v) => onUpdate(row.id, "count", v)}
        />
        <CounterInput
          label={index === 0 ? "Marks" : undefined}
          value={row.marksPerQuestion}
          onChange={(v) => onUpdate(row.id, "marksPerQuestion", v)}
        />
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          disabled={!canRemove}
          className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 self-end mb-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile card */}
      <div className="md:hidden bg-gray-50 rounded-xl p-4 space-y-3 relative">
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          disabled={!canRemove}
          className="absolute top-3 right-3 p-1 text-gray-400 disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>
        <select
          value={row.type}
          onChange={(e) => onUpdate(row.id, "type", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {DEFAULT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <CounterInput
            label="No. of Questions"
            value={row.count}
            onChange={(v) => onUpdate(row.id, "count", v)}
          />
          <CounterInput
            label="Marks"
            value={row.marksPerQuestion}
            onChange={(v) => onUpdate(row.id, "marksPerQuestion", v)}
          />
        </div>
        {(errors[`count_${index}`] || errors[`marks_${index}`]) && (
          <p className="text-xs text-red-500">
            {errors[`count_${index}`] || errors[`marks_${index}`]}
          </p>
        )}
      </div>
    </>
  );
}
