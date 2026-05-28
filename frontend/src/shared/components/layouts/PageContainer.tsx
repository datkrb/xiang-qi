import React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  className?: string;
}

export function PageContainer({
  children,
  maxWidth = "3xl",
  className = "",
}: PageContainerProps) {
  const maxWidthClass = maxWidth === "full" ? "w-full" : `max-w-${maxWidth}`;
  
  return (
    <div className={`w-full p-4 md:p-8 animate-fade-in ${className}`}>
      <div className={`${maxWidthClass} mx-auto space-y-6`}>
        {children}
      </div>
    </div>
  );
}
