import { LucideIcon } from "lucide-react";

interface StatsWidgetProps {
  value: string | number;
  label: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatsWidget({
  value,
  label,
  icon: Icon,
  trend,
  color = "text-primary",
}: StatsWidgetProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
      <div className={`p-3 rounded-full bg-muted ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {trend && (
          <p
            className={`text-xs mt-2 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </p>
        )}
      </div>
    </div>
  );
}
