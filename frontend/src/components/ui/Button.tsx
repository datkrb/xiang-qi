import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Disable the button */
  disabled?: boolean;
  /** Show loading state */
  isLoading?: boolean;
}

/**
 * Reusable Button component with multiple variants and sizes
 *
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="secondary" disabled>Disabled</Button>
 * <Button variant="ghost" isLoading>Loading...</Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Build size classes
    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Build disabled/loading classes
    const stateClasses =
      disabled || isLoading
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer transition-colors";

    const baseClasses = [
      "rounded-md font-medium",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      sizeClasses[size],
      stateClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Build variant styles using CSS variables
    const variantStyles = {
      primary: {
        backgroundColor: "var(--color-primary)",
        color: "var(--color-primary-foreground)",
        border: "1px solid var(--color-primary-hover)",
      } as React.CSSProperties,
      secondary: {
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text-main)",
        border: "1px solid var(--color-border)",
      } as React.CSSProperties,
      ghost: {
        backgroundColor: "transparent",
        color: "var(--color-text-main)",
        border: "1px solid transparent",
      } as React.CSSProperties,
    };

    const hoverStyles = {
      primary: {
        backgroundColor: "var(--color-primary-hover)",
      },
      secondary: {
        backgroundColor: "var(--color-surface-hover)",
      },
      ghost: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    };

    return (
      <button
        ref={ref}
        className={`${baseClasses} hover:opacity-90`}
        style={
          {
            ...variantStyles[variant],
            "--hover-bg": Object.values(hoverStyles[variant])[0],
          } as React.CSSProperties
        }
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
