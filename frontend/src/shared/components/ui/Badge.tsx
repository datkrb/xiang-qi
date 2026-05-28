import React from "react";
import { X } from "lucide-react";

export type BadgeVariant = "success" | "error" | "warning" | "info" | "default";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {
  /** Badge status variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Show close button */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
} as const;

const variantStyles = {
  success: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "var(--color-success)",
    borderColor: "var(--color-success)",
    border: "1px solid var(--color-success)",
  },
  error: {
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    color: "var(--color-danger)",
    borderColor: "var(--color-danger)",
    border: "1px solid var(--color-danger)",
  },
  warning: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "var(--color-warning, #f59e0b)",
    borderColor: "var(--color-warning, #f59e0b)",
    border: "1px solid var(--color-warning, #f59e0b)",
  },
  info: {
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    color: "var(--color-primary)",
    borderColor: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
  },
  default: {
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text-main)",
    borderColor: "var(--color-border)",
    border: "1px solid var(--color-border)",
  },
} as const;

/**
 * Reusable Badge component for status labels
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" dismissible onDismiss={handleDismiss}>Error</Badge>
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      dismissible,
      onDismiss,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const badgeClasses = [
      "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
      sizeClasses[size],
      dismissible && "pr-1.5",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={badgeClasses}
        style={variantStyles[variant]}
        {...props}
      >
        <span>{children}</span>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="inline-flex items-center justify-center p-0.5 hover:opacity-70 transition-opacity focus:outline-none"
            aria-label="Dismiss badge"
          >
            <X size={size === "lg" ? 18 : size === "sm" ? 14 : 16} />
          </button>
        )}
      </span>
    );
  },
);

Badge.displayName = "Badge";
