import React from "react";

export type CardVariant = "elevated" | "outlined";
export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Card visual style */
  variant?: CardVariant;
  /** Internal padding */
  padding?: CardPadding;
  /** Header content */
  header?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
}

interface CardComponentType extends React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> {
  Header: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<"div"> & React.RefAttributes<HTMLDivElement>
  >;
  Footer: React.ForwardRefExoticComponent<
    React.ComponentPropsWithoutRef<"div"> & React.RefAttributes<HTMLDivElement>
  >;
}

const variantClasses = {
  elevated: "shadow-md",
  outlined: "border",
} as const;

const paddingClasses = {
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
} as const;

const variantStyles = {
  elevated: {
    borderColor: "var(--color-border)",
    border: "1px solid var(--color-border)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  outlined: {
    borderColor: "var(--color-border)",
    border: "1px solid var(--color-border)",
  },
} as const;

/**
 * Reusable Card component for grouping content
 *
 * @example
 * <Card padding="md" variant="elevated">
 *   <Card.Header>Title</Card.Header>
 *   <div>Content goes here</div>
 *   <Card.Footer>Footer content</Card.Footer>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      padding = "md",
      header,
      footer,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const cardClasses = ["rounded-lg", variantClasses[variant], className]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={cardClasses}
        style={{
          backgroundColor: "var(--color-surface)",
          ...variantStyles[variant],
        }}
        {...props}
      >
        {header && (
          <div
            className="border-b pb-3 mb-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {header}
          </div>
        )}
        <div className={paddingClasses[padding]}>{children}</div>
        {footer && (
          <div
            className="border-t pt-3 mt-3"
            style={{ borderColor: "var(--color-border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);

/**
 * Header sub-component for Card
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`border-b pb-3 mb-3 ${className || ""}`}
    style={{ borderColor: "var(--color-border)" }}
    {...props}
  />
));

CardHeader.displayName = "Card.Header";

/**
 * Footer sub-component for Card
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`border-t pt-3 mt-3 ${className || ""}`}
    style={{ borderColor: "var(--color-border)" }}
    {...props}
  />
));

CardFooter.displayName = "Card.Footer";

// Assign sub-components to main component
Card.displayName = "Card";
(Card as any).Header = CardHeader;
(Card as any).Footer = CardFooter;

// Export Card with proper typing that includes Header and Footer sub-components
const CardWithSubcomponents = Card as unknown as CardComponentType;

export { CardWithSubcomponents as Card };
export type { CardComponentType as CardComponent };
