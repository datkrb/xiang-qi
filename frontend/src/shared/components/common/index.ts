// Export all compound components
export { Form } from "./Form";
export type { FormProps } from "./Form";

export { Modal } from "./Modal";
export type { ModalProps } from "./Modal";

// Re-exports from legacy root `components/` to ease migration
export { default as AppSidebar } from "@shared/components/layouts/AppSidebar";
export { ControlPanel } from "@shared/components/game/ControlPanel";
export { default as MatchFoundDialog } from "@shared/components/game/MatchFoundDialog";
export { default as ThemeSwitcher } from "@features/settings/screens/ThemeSwitcher";
export { PlayerInfoCard } from "@shared/components/game/PlayerInfoCard";
export * from "@shared/components/game/PlayerCard";
export * from "@shared/components/game/GameDialogs";
