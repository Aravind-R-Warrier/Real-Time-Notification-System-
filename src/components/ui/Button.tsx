import React from "react";
import Spinner from "../common/Spinner";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition-all focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {/* Loading Spinner */}
      {loading && (
        <Spinner size={18} />
      )}

      {/* Left Icon */}
      {!loading && leftIcon && (
        <span className="mr-2 flex items-center">{leftIcon}</span>
      )}

      {/* Label */}
      <span>{children}</span>

      {/* Right Icon */}
      {!loading && rightIcon && (
        <span className="ml-2 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}
