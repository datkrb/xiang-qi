import React from "react";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "small"
  | "label"
  | "caption";

export interface TextProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Text variant/level */
  variant?: TextVariant;
  /** Truncate text to single line */
  truncate?: boolean;
  /** Custom color using CSS variable */
  color?: string;
  /** Font weight */
  weight?: "normal" | "medium" | "semibold" | "bold";
}

const variantConfig = {
  h1: {
    element: "h1",
    classes: "text-3xl md:text-4xl font-bold leading-tight",
    colorVar: "--color-text-main",
  },
  h2: {
    element: "h2",
    classes: "text-2xl md:text-3xl font-bold leading-snug",
    colorVar: "--color-text-main",
  },
  h3: {
    element: "h3",
    classes: "text-xl md:text-2xl font-semibold leading-snug",
    colorVar: "--color-text-main",
  },
  h4: {
    element: "h4",
    classes: "text-lg md:text-xl font-semibold",
    colorVar: "--color-text-main",
  },
  h5: {
    element: "h5",
    classes: "text-base md:text-lg font-semibold",
    colorVar: "--color-text-main",
  },
  h6: {
    element: "h6",
    classes: "text-sm md:text-base font-semibold",
    colorVar: "--color-text-main",
  },
  body: {
    element: "p",
    classes: "text-base leading-relaxed",
    colorVar: "--color-text-main",
  },
  small: {
    element: "p",
    classes: "text-sm leading-normal",
    colorVar: "--color-text-muted",
  },
  label: {
    element: "label",
    classes: "text-sm font-medium",
    colorVar: "--color-text-main",
  },
  caption: {
    element: "span",
    classes: "text-xs",
    colorVar: "--color-text-muted",
  },
} as const;

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

/**
 * Reusable Text component for typography
 *
 * @example
 * <Text variant="h1">Page Title</Text>
 * <Text variant="body">Regular paragraph text</Text>
 * <Text variant="caption" truncate>Truncated caption</Text>
 */
export const Text = React.forwardRef<HTMLDivElement, TextProps>(
  (
    {
      variant = "body",
      truncate,
      className,
      weight = "normal",
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const config = variantConfig[variant];
    const Element = config.element as any;

    const textClasses = [
      config.classes,
      weightClasses[weight],
      truncate && "truncate",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Element
        ref={ref}
        className={textClasses}
        style={{
          color: `var(${config.colorVar})`,
          ...style,
        }}
        {...props}
      >
        {children}
      </Element>
    );
  },
);

Text.displayName = "Text";
