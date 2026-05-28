
import { Toggle } from "@shared/components/ui";

export function SettingsToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-surface-opaque rounded-xl border border-transparent hover:border-border transition-colors overflow-hidden">
      <span className="text-main font-semibold shrink">{label}</span>
      <div className="shrink-0">
        <Toggle
          isChecked={checked}
          onChange={onChange}
          size="sm"
          aria-label={label}
        />
      </div>
    </div>
  );
}
