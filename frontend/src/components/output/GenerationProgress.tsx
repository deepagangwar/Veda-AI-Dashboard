"use client";

interface GenerationProgressProps {
  progress: number;
  message: string;
}

export function GenerationProgress({
  progress,
  message,
}: GenerationProgressProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-6" />
      <h2 className="text-lg font-semibold mb-2">Generating Question Paper</h2>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-md">{message}</p>
      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
        <div
          className="bg-brand-orange h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-2">{progress}%</p>
    </div>
  );
}
