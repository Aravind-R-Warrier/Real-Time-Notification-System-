import React from "react";

type IconName =
  | "bell"
  | "trash"
  | "check"
  | "warning"
  | "info"
  | "error";

const icons: Record<IconName, JSX.Element> = {
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2C10.9 2 10 2.9 10 4v1c-3 1-5 4-5 7v4l-2 2v1h18v-1l-2-2v-4c0-3-2-6-5-7V4c0-1.1-.9-2-2-2z" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </svg>
  ),

  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 6h18" />
      <path d="M8 6v14h8V6" />
      <path d="M10 10v6M14 10v6" />
      <path d="M9 6l1-2h4l1 2" />
    </svg>
  ),

  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12l6 6L20 6" />
    </svg>
  ),

  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.3 3.4L1.8 18.2A1 1 0 0 0 2.7 19.7h18.6a1 1 0 0 0 .9-1.5L13.7 3.4a1 1 0 0 0-1.7 0z" />
    </svg>
  ),

  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),

  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
};

export default function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span className={`inline-block w-5 h-5 ${className}`}>
      {icons[name]}
    </span>
  );
}
