import React, { useCallback } from "react";

export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends Omit<
  React.ComponentPropsWithoutRef<"button">,
  "onChange"
> {
  /** Controlled checked state */
  isChecked: boolean;
  /** Change handler receives new checked value */
  onChange: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Optional label rendered alongside the switch */
  label?: string;
  /** Size */
  size?: ToggleSize;
}

const sizeMap = {
  sm: { width: 36, height: 20, indicator: 14 },
  md: { width: 48, height: 28, indicator: 20 },
  lg: { width: 64, height: 36, indicator: 28 },
} as const;

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      isChecked,
      onChange,
      disabled = false,
      label,
      size = "md",
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const dims = sizeMap[size];

    const handleToggle = useCallback(
      (_e?: React.SyntheticEvent) => {
        if (disabled) return;
        onChange(!isChecked);
      },
      [disabled, isChecked, onChange],
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onChange(!isChecked);
      }
    };

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: disabled ? "not-allowed" : "pointer",
      userSelect: "none",
      ...style,
    };

    const switchStyle: React.CSSProperties = {
      width: dims.width,
      height: dims.height,
      borderRadius: dims.height / 2,
      backgroundColor: isChecked
        ? "var(--color-primary)"
        : "var(--color-surface)",
      border: `1px solid var(--color-border)`,
      position: "relative",
      transition:
        "background-color 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      display: "inline-block",
      flexShrink: 0,
      outline: "none",
      cursor: disabled ? "not-allowed" : "pointer",
    };

    const indicatorStyle: React.CSSProperties = {
      width: dims.indicator,
      height: dims.indicator,
      borderRadius: "50%",
      backgroundColor: isChecked
        ? "var(--color-primary-foreground)"
        : "var(--color-text-main)",
      position: "absolute",
      top: "50%",
      transform: `translateY(-50%) translateX(${isChecked ? dims.width - dims.indicator - 4 : 4}px)`,
      transition: "transform 0.18s ease, background-color 0.18s ease",
      boxShadow: "rgba(0,0,0,0.12) 0 1px 2px",
    };

    return (
      <label style={baseStyle} className={className}>
        <button
          ref={ref}
          role="switch"
          aria-checked={isChecked}
          aria-label={label}
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90 transition-opacity"
          style={{
            ...switchStyle,
            boxShadow: isChecked
              ? "0 0 0 4px rgba(14,165,233,0.12)"
              : undefined,
          }}
          {...props}
        >
          <span style={indicatorStyle} />
        </button>
        {label ? (
          <span style={{ color: "var(--color-text-main)", fontSize: 14 }}>
            {label}
          </span>
        ) : null}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";

export default Toggle;
