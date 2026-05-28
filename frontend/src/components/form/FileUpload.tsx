"use client";

import { useCallback, useState } from "react";
import { CloudUpload } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileUpload({ file, onFileChange }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileChange(dropped);
    },
    [onFileChange]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        dragOver ? "border-brand-orange bg-orange-50" : "border-gray-200"
      }`}
    >
      <CloudUpload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-600 mb-1">
        {file ? file.name : "Choose a file or drag & drop it here"}
      </p>
      <p className="text-xs text-gray-400 mb-4">
        PDF, TXT, JPEG, PNG — up to 10MB (optional)
      </p>
      <label className="inline-block px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
        Browse Files
        <input
          type="file"
          className="hidden"
          accept=".pdf,.txt,.png,.jpg,.jpeg"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}
