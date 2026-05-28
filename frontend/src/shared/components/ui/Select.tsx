import React from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  errorMessage?: string;
  className?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, errorMessage, className = "", wrapperClassName = "", ...props },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <label className="text-sm font-semibold text-main">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={`w-full appearance-none px-3 py-2 bg-surface-opaque outline-none border border-border rounded-lg text-main focus:border-primary transition-colors ${
              errorMessage ? "border-danger" : ""
            } ${className}`}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-muted absolute right-3 pointer-events-none" />
        </div>
        {errorMessage && (
          <span className="text-xs text-danger">{errorMessage}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
