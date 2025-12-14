import React from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "border" | "background";
  className?: string;
};

export default function PageHeader({
  title,
  subtitle,
  description,
  actions,
  align = "left",
  size = "md",
  variant = "default",
  className = "",
}: PageHeaderProps) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center mx-auto",
  };

  const variantClasses = {
    default: "",
    border: "pb-6 border-b border-gray-200 dark:border-gray-800",
    background: "px-6 py-8 rounded-xl bg-gray-50 dark:bg-gray-900/50",
  };

  return (
    <header 
      className={`mb-10 ${variantClasses[variant]} ${className}`.trim()}
    >
      <div className={alignClasses[align]}>
        {/* Subtitle */}
        {subtitle && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              {subtitle}
            </span>
          </div>
        )}

        {/* Title and Actions Container */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            {/* Title with gradient effect */}
            <h1 
              className={`${sizeClasses[size]} font-bold tracking-tight text-gray-900 dark:text-white`}
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            {/* Decorative underline for title */}
            <div className="w-16 h-1 mt-4 rounded-full bg-gradient-to-r from-primary-500 to-blue-500"></div>

            {/* Description */}
            {description && (
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          {actions && (
            <div className="flex-shrink-0">
              <div className="flex flex-wrap gap-3">
                {actions}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}