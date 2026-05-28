import React, { useEffect } from "react";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size */
  size?: ModalSize;
  /** Whether clicking outside closes modal */
  dismissible?: boolean;
  /** Title text */
  title?: string;
}

export interface ModalHeaderProps {
  title?: string;
  onClose?: () => void;
}

export interface ModalBodyProps {
  children: React.ReactNode;
}

export interface ModalFooterProps {
  children: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
} as const;

/**
 * Modal header component
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div
    className="flex items-center justify-between pb-3 border-b"
    style={{ borderColor: "var(--color-border)" }}
  >
    {title && (
      <h2
        className="text-lg font-semibold"
        style={{ color: "var(--color-text-main)" }}
      >
        {title}
      </h2>
    )}
    {onClose && (
      <button
        onClick={onClose}
        className="p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          color: "var(--color-text-main)",
          backgroundColor: "var(--color-surface-hover)",
        }}
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
    )}
  </div>
);

ModalHeader.displayName = "Modal.Header";

/**
 * Modal body component
 */
const ModalBody: React.FC<ModalBodyProps> = ({ children }) => (
  <div className="py-4 max-h-96 overflow-y-auto">{children}</div>
);

ModalBody.displayName = "Modal.Body";

/**
 * Modal footer component
 */
const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => (
  <div
    className="pt-3 border-t flex gap-2 justify-end"
    style={{ borderColor: "var(--color-border)" }}
  >
    {children}
  </div>
);

ModalFooter.displayName = "Modal.Footer";

/**
 * Modal overlay component
 */
const ModalOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  dismissible: boolean;
  size: ModalSize;
  children: React.ReactNode;
}> = ({ isOpen, onClose, dismissible, size, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={`relative rounded-lg shadow-lg ${sizeClasses[size]} w-full mx-4 max-h-96`}
        style={{
          backgroundColor: "var(--color-surface)",
        }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Reusable Modal component
 *
 * @example
 * <Modal isOpen={open} onClose={handleClose} title="Confirm">
 *   <Modal.Body>Are you sure?</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={handleClose}>Cancel</Button>
 *     <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
 *   </Modal.Footer>
 * </Modal>
 */
const ModalComponent: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  dismissible = true,
  title,
}) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      dismissible={dismissible}
      size={size}
    >
      {title && <ModalHeader title={title} onClose={onClose} />}
      {children}
    </ModalOverlay>
  );
};

ModalComponent.displayName = "Modal";

/**
 * Compound Modal component
 */
export const Modal = Object.assign(ModalComponent, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});
