import React, { useState } from "react";
import { Button, Text, Input, Card, Badge, Toggle } from "../ui";
import { Modal } from "../common/Modal";
import { Form } from "../common/Form";

type Theme = "blue" | "dark" | "light";

/**
 * Component Showcase Page
 * Displays all UI components with all variants, sizes, and states
 * Includes theme switcher for testing across themes
 */
export const ComponentShowcasePage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("blue");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInput, setFormInput] = useState("");
  const [toggleOn, setToggleOn] = useState(false);

  // Apply theme to document
  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    if (theme === "blue") {
      document.documentElement.className = "";
    } else {
      document.documentElement.className = `theme-${theme}`;
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Header with Theme Switcher */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Text variant="h1">UI Component Showcase</Text>
            <Text variant="body" style={{ color: "var(--color-text-muted)" }}>
              Explore all available components with their variants and
              configurations
            </Text>
          </div>

          {/* Theme Switcher */}
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <Text variant="label" className="block mb-2">
              Theme:
            </Text>
            <div className="flex gap-2">
              {["blue", "dark", "light"].map((theme) => (
                <Button
                  key={theme}
                  variant={currentTheme === theme ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handleThemeChange(theme as Theme)}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Button Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Button Component</Text>
            </Card.Header>
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <Text variant="h4" className="mb-3">
                  Variants
                </Text>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Text variant="h4" className="mb-3">
                  Sizes
                </Text>
                <div className="flex gap-3 items-center flex-wrap">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <Text variant="h4" className="mb-3">
                  States
                </Text>
                <div className="flex gap-3 flex-wrap">
                  <Button disabled>Disabled</Button>
                  <Button isLoading>Loading</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Text Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Text Component</Text>
            </Card.Header>
            <div className="space-y-4">
              <div>
                <Text variant="h1">Heading 1</Text>
              </div>
              <div>
                <Text variant="h2">Heading 2</Text>
              </div>
              <div>
                <Text variant="h3">Heading 3</Text>
              </div>
              <div>
                <Text variant="h4">Heading 4</Text>
              </div>
              <div>
                <Text variant="h5">Heading 5</Text>
              </div>
              <div>
                <Text variant="h6">Heading 6</Text>
              </div>
              <div>
                <Text variant="body">
                  This is body text. It should be readable at normal sizes with
                  standard line-height.
                </Text>
              </div>
              <div>
                <Text variant="small">
                  This is small text for descriptions.
                </Text>
              </div>
              <div>
                <Text variant="label">This is label text for form fields.</Text>
              </div>
              <div>
                <Text variant="caption">
                  This is caption text for metadata.
                </Text>
              </div>

              {/* Truncate */}
              <div>
                <Text
                  variant="body"
                  truncate
                  style={{ maxWidth: "300px" }}
                  title="This is truncated text that will be cut off after one line"
                >
                  This is truncated text that will be cut off after one line
                  with ellipsis indicator
                </Text>
              </div>
            </div>
          </Card>

          {/* Input Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Input Component</Text>
            </Card.Header>
            <div className="space-y-6">
              <div>
                <Text variant="h4" className="mb-3">
                  States
                </Text>
                <div className="space-y-4">
                  <Input label="Default" placeholder="Enter text..." />
                  <Input
                    label="With Helper Text"
                    placeholder="Enter email..."
                    helperText="We'll never share your email."
                  />
                  <Input
                    label="Error State"
                    validationState="error"
                    errorMessage="This field is required"
                    defaultValue="invalid"
                  />
                  <Input
                    label="Success State"
                    validationState="success"
                    successMessage="Email is valid"
                    defaultValue="valid@example.com"
                  />
                  <Input
                    label="Warning State"
                    validationState="warning"
                    warningMessage="Email domain is uncommon"
                    defaultValue="test@example.local"
                  />
                  <Input label="Disabled" disabled defaultValue="Cannot edit" />
                </div>
              </div>

              {/* Sizes */}
              <div>
                <Text variant="h4" className="mb-3">
                  Sizes
                </Text>
                <div className="space-y-4">
                  <Input size="sm" placeholder="Small input" />
                  <Input size="md" placeholder="Medium input" />
                  <Input size="lg" placeholder="Large input" />
                </div>
              </div>
            </div>
          </Card>

          {/* Card Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Card Component</Text>
            </Card.Header>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card variant="elevated" padding="md">
                  <Card.Header>
                    <Text variant="h4">Elevated Card</Text>
                  </Card.Header>
                  <Text variant="body">
                    This is an elevated card with shadow.
                  </Text>
                  <Card.Footer>
                    <Button size="sm">Action</Button>
                  </Card.Footer>
                </Card>

                <Card variant="outlined" padding="md">
                  <Card.Header>
                    <Text variant="h4">Outlined Card</Text>
                  </Card.Header>
                  <Text variant="body">
                    This is an outlined card with border.
                  </Text>
                  <Card.Footer>
                    <Button size="sm">Action</Button>
                  </Card.Footer>
                </Card>
              </div>

              {/* Padding variations */}
              <div>
                <Text variant="h4" className="mb-3">
                  Padding Sizes
                </Text>
                <div className="space-y-3">
                  <Card variant="outlined" padding="sm">
                    <Text variant="body">Small padding</Text>
                  </Card>
                  <Card variant="outlined" padding="md">
                    <Text variant="body">Medium padding</Text>
                  </Card>
                  <Card variant="outlined" padding="lg">
                    <Text variant="body">Large padding</Text>
                  </Card>
                </div>
              </div>
            </div>
          </Card>

          {/* Badge Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Badge Component</Text>
            </Card.Header>
            <div className="space-y-6">
              <div>
                <Text variant="h4" className="mb-3">
                  Variants
                </Text>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <Text variant="h4" className="mb-3">
                  Sizes
                </Text>
                <div className="flex gap-2 flex-wrap items-center">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              <div>
                <Text variant="h4" className="mb-3">
                  Dismissible
                </Text>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="success" dismissible onDismiss={() => {}}>
                    Can dismiss
                  </Badge>
                  <Badge variant="error" dismissible onDismiss={() => {}}>
                    Can dismiss
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Toggle Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Toggle Component</Text>
            </Card.Header>
            <div className="space-y-6">
              <div>
                <Text variant="h4" className="mb-3">
                  Variants & Sizes
                </Text>
                <div className="flex gap-4 items-center">
                  <Toggle
                    isChecked={toggleOn}
                    onChange={setToggleOn}
                    size="sm"
                  />
                  <Toggle
                    isChecked={toggleOn}
                    onChange={setToggleOn}
                    size="md"
                  />
                  <Toggle
                    isChecked={toggleOn}
                    onChange={setToggleOn}
                    size="lg"
                  />
                </div>
              </div>

              <div>
                <Text variant="h4" className="mb-3">
                  Labeled
                </Text>
                <div className="flex gap-4 items-center">
                  <Toggle
                    isChecked={toggleOn}
                    onChange={setToggleOn}
                    label="Enable"
                  />
                  <Toggle
                    isChecked={!toggleOn}
                    onChange={(v: boolean) => setToggleOn(!v)}
                    label="Disable"
                  />
                </div>
              </div>

              <div>
                <Text variant="h4" className="mb-3">
                  Disabled
                </Text>
                <div className="flex gap-4 items-center">
                  <Toggle isChecked={true} onChange={() => {}} disabled />
                  <Toggle isChecked={false} onChange={() => {}} disabled />
                </div>
              </div>
            </div>
          </Card>

          {/* Form Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Form Component</Text>
            </Card.Header>
            <Form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
                e.preventDefault()
              }
            >
              <Form.Field
                label="Full Name"
                error={formInput === "error" ? "Required field" : undefined}
              >
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormInput(e.target.value)
                  }
                />
              </Form.Field>

              <Form.Field label="Email">
                <Input type="email" placeholder="john@example.com" />
              </Form.Field>

              <Form.Field label="Message">
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Your message here..."
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                />
              </Form.Field>

              <Form.Actions
                submitLabel="Send"
                cancelLabel="Clear"
                onCancel={() => setFormInput("")}
              />
            </Form>
          </Card>

          {/* Modal Section */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Modal Component</Text>
            </Card.Header>
            <div className="space-y-4">
              <Button onClick={() => setIsModalOpen(true)}>
                Open Modal Example
              </Button>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Modal Example"
                dismissible
              >
                <Modal.Body>
                  <Text variant="body">
                    This is an example modal dialog. It can contain any content
                    and is dismissible via the close button, Escape key, or
                    backdrop click.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>

              <Text variant="caption">
                Try clicking outside the modal or pressing Escape to close it.
              </Text>
            </div>
          </Card>

          {/* Props Documentation */}
          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Text variant="h2">Component Props Reference</Text>
            </Card.Header>
            <div className="space-y-6 text-sm">
              <div>
                <Text variant="h4" className="mb-2">
                  Button
                </Text>
                <Text variant="caption">
                  variant: "primary" | "secondary" | "ghost"; size: "sm" | "md"
                  | "lg"; disabled?: boolean; isLoading?: boolean
                </Text>
              </div>

              <div>
                <Text variant="h4" className="mb-2">
                  Text
                </Text>
                <Text variant="caption">
                  variant: "h1"-"h6" | "body" | "small" | "label" | "caption";
                  truncate?: boolean; weight?: "normal" | "medium" | "semibold"
                  | "bold"
                </Text>
              </div>

              <div>
                <Text variant="h4" className="mb-2">
                  Input
                </Text>
                <Text variant="caption">
                  size: "sm" | "md" | "lg"; validationState: "default" | "error"
                  | "success" | "warning"; label?: string; helperText?: string;
                  errorMessage?: string
                </Text>
              </div>

              <div>
                <Text variant="h4" className="mb-2">
                  Card
                </Text>
                <Text variant="caption">
                  variant: "elevated" | "outlined"; padding: "sm" | "md" | "lg";
                  header?: ReactNode; footer?: ReactNode
                </Text>
              </div>

              <div>
                <Text variant="h4" className="mb-2">
                  Badge
                </Text>
                <Text variant="caption">
                  variant: "success" | "error" | "warning" | "info" | "default";
                  size: "sm" | "md" | "lg"; dismissible?: boolean; onDismiss?:
                  () =&gt; void
                </Text>
              </div>

              <div>
                <Text variant="h4" className="mb-2">
                  Modal
                </Text>
                <Text variant="caption">
                  isOpen: boolean; onClose: () =&gt; void; title?: string; size:
                  "sm" | "md" | "lg"; dismissible?: boolean
                </Text>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

ComponentShowcasePage.displayName = "ComponentShowcasePage";
