import React from "react";

export default function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-700"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
