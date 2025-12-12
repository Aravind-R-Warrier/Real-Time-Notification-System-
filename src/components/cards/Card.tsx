import React from "react";

export const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    {title && <div className="mb-3 flex items-center justify-between"><h4 className="font-semibold">{title}</h4></div>}
    <div>{children}</div>
  </div>
);
