// src/components/cards/Card.tsx
import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = "", 
  action 
}) => (
  <div className={`
    bg-white dark:bg-gray-800 
    rounded-xl 
    shadow-sm dark:shadow-gray-900/30 
    border border-gray-200 dark:border-gray-700 
    p-6
    transition-colors duration-200
    ${className}
  `}>
    {(title || action) && (
      <div className="mb-4 flex items-center justify-between">
        {title && (
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h4>
        )}
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    )}
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);