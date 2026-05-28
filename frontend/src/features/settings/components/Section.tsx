import React from "react";
import { Card, Text } from "@shared/components/ui";

export function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card variant="elevated" padding="lg">
      <Text variant="h3" className="mb-4 flex items-center gap-2">
        {icon} {title}
      </Text>
      <div className="space-y-3">{children}</div>
    </Card>
  );
}
