import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType, icon: Icon, iconColor }: StatCardProps) {
  return (
    <Card className="stat-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-2">{value}</p>
            {change && (
              <p className={`stat-change mt-2 ${changeType === 'positive' ? 'stat-change-positive' : changeType === 'negative' ? 'stat-change-negative' : ''}`}>
                {change}
              </p>
            )}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--stat-icon-bg))]">
            <Icon className="h-6 w-6 text-[hsl(var(--stat-icon-color))]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
