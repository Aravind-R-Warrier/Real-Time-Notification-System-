import React from "react";

type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
  title = "No Data",
  message = "There’s nothing to show here yet.",
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 text-gray-500 ${className}`}
    >
      <div className="text-4xl mb-3">
        {icon ?? <span>📭</span>}
      </div>

      <div className="font-semibold text-gray-700">{title}</div>

      {message && (
        <div className="text-sm mt-1 text-gray-500 max-w-xs">
          {message}
        </div>
      )}
    </div>
  );
}
