// src/components/cards/Card.tsx
import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className = "", 
  actions 
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
    {(title || actions) && (
      <div className="mb-4 flex items-center justify-between">
        {title && (
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h4>
        )}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);