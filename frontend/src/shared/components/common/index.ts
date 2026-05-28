// Export all compound components
export { Form } from "./Form";
export type { FormProps } from "./Form";

export { Modal } from "./Modal";
export type { ModalProps } from "./Modal";

export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard";

// Re-exports from legacy root `components/` to ease migration
export { default as AppSidebar } from "@shared/components/layouts/AppSidebar";
export { ThemeSwitcher } from "@features/settings/components/ThemeSwitcher";
