
import { Card, Text } from "../ui";

export interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export function StatCard({ label, value, color = "text-main", className = "" }: StatCardProps) {
  return (
    <Card variant="elevated" className={`text-center py-4 px-2 ${className}`}>
      <div className={`text-3xl font-bold font-heading ${color}`}>{value}</div>
      <Text variant="caption" className="mt-1 uppercase tracking-wider font-semibold">
        {label}
      </Text>
    </Card>
  );
}
