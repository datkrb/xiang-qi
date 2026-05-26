import React from "react";

export type InputSize = "sm" | "md" | "lg";
export type ValidationState = "default" | "error" | "success" | "warning";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** Input size */
  size?: InputSize;
  /** Validation state */
  validationState?: ValidationState;
  /** Error message to display */
  errorMessage?: string;
  /** Success message to display */
  successMessage?: string;
  /** Warning message to display */
  warningMessage?: string;
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
}

const sizeClasses = {
  sm: "px-2 py-1 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-3 text-lg",
} as const;

const stateStyles = {
  default: {
    borderColor: "var(--color-border)",
    focusBorderColor: "var(--color-primary)",
    focusRingColor: "var(--color-primary)",
    backgroundColor: "var(--color-surface)",
  },
  error: {
    borderColor: "var(--color-danger)",
    focusBorderColor: "var(--color-danger)",
    focusRingColor: "var(--color-danger)",
    backgroundColor: "rgba(244, 63, 94, 0.05)",
  },
  success: {
    borderColor: "var(--color-success)",
    focusBorderColor: "var(--color-success)",
    focusRingColor: "var(--color-success)",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  warning: {
    borderColor: "var(--color-warning, #f59e0b)",
    focusBorderColor: "var(--color-warning, #f59e0b)",
    focusRingColor: "var(--color-warning, #f59e0b)",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
} as const;

const messageStyles = {
  error: { color: "var(--color-danger)" },
  success: { color: "var(--color-success)" },
  warning: { color: "var(--color-warning, #f59e0b)" },
  default: { color: "var(--color-text-muted)" },
} as const;

/**
 * Reusable Input component for form fields
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 * <Input validationState="error" errorMessage="Invalid email" />
 * <Input validationState="success" successMessage="Email is valid" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      validationState = "default",
      errorMessage,
      successMessage,
      warningMessage,
      label,
      helperText,
      disabled,
      className,
      ...props
    },
    ref,
  ) => {
    const inputClasses = [
      "w-full rounded-md border",
      "focus:outline-none focus:ring-2 focus:ring-offset-0",
      "transition-colors",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const messageText = errorMessage || successMessage || warningMessage;
    const messageType = errorMessage
      ? "error"
      : successMessage
        ? "success"
        : warningMessage
          ? "warning"
          : "default";

    const stateStyle = stateStyles[validationState];

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "var(--color-text-main)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          style={{
            borderColor: stateStyle.borderColor,
            backgroundColor: stateStyle.backgroundColor,
            color: "var(--color-text-main)",
            caretColor: "var(--color-primary)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = stateStyle.focusBorderColor;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = stateStyle.borderColor;
          }}
          {...props}
        />
        {helperText && (
          <p
            className="text-xs mt-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            {helperText}
          </p>
        )}
        {messageText && (
          <p className="text-xs mt-1" style={messageStyles[messageType]}>
            {messageText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
