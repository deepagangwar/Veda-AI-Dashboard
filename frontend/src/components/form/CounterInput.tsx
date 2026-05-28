"use client";

import { Minus, Plus } from "lucide-react";

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  label?: string;
}

export function CounterInput({
  value,
  onChange,
  min = 1,
  label,
}: CounterInputProps) {
  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      )}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-3 py-2 hover:bg-gray-50 text-gray-500"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="flex-1 text-center text-sm font-medium py-2 border-x border-gray-200">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="px-3 py-2 hover:bg-gray-50 text-gray-500"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
