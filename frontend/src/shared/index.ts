// Main shared layer re-export
// This file serves as the primary entrypoint for all shared exports
// Components, hooks, utilities, types, services, theme, and i18n

// Direct sub-layer exports - avoid circular dependencies
export * from "./hooks";
export * from "./utils";
export * from "./services";
export * from "./theme";
export * from "./i18n";

// Components and types should be imported from specific sub-paths to avoid conflicts
// @shared/components for UI components
// @shared/types for type definitions
