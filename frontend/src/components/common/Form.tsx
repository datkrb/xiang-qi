import React from "react";
import { Button } from "../ui";

export interface FormProps extends React.ComponentPropsWithoutRef<"form"> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

/**
 * Reusable Form compound component
 *
 * @example
 * <Form onSubmit={handleSubmit}>
 *   <Form.Field label="Email" error={errors.email}>
 *     <Input type="email" name="email" />
 *   </Form.Field>
 *   <Form.Actions submitLabel="Login" onCancel={handleCancel} />
 * </Form>
 */
const FormComponent = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => (
    <form ref={ref} className={`space-y-4 ${className || ""}`} {...props}>
      {children}
    </form>
  ),
);

FormComponent.displayName = "Form";

/**
 * Form.Field - Individual form field wrapper
 */
const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => (
  <div className="space-y-1">
    {label && (
      <label
        className="block text-sm font-medium"
        style={{ color: "var(--color-text-main)" }}
      >
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>
        {error}
      </p>
    )}
  </div>
);

FormField.displayName = "Form.Field";

/**
 * Form.Actions - Button group for form submission
 */
const FormActions: React.FC<FormActionsProps> = ({
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting,
}) => (
  <div
    className="flex gap-3 pt-4 border-t"
    style={{ borderColor: "var(--color-border)" }}
  >
    <Button
      type="submit"
      variant="primary"
      disabled={isSubmitting}
      isLoading={isSubmitting}
    >
      {submitLabel}
    </Button>
    {onCancel && (
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
    )}
  </div>
);

FormActions.displayName = "Form.Actions";

/**
 * Compound Form component with Field and Actions
 */
export const Form = Object.assign(FormComponent, {
  Field: FormField,
  Actions: FormActions,
});
