import React from "react";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: number;
  onChange?: (value: number) => void;
  className?: string;
  wrapperClassName?: string;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    { label, value, onChange, className = "", wrapperClassName = "", ...props },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-2 ${wrapperClassName}`}>
        {label && (
          <div className="flex justify-between text-sm text-main">
            <span className="font-semibold">{label}</span>
            <span className="font-bold text-primary">{value}%</span>
          </div>
        )}
        <input
          ref={ref}
          type="range"
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className={`w-full accent-primary cursor-pointer ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";
