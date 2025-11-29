export type WidgetType = 
  | "stats-students"
  | "stats-payments"
  | "stats-teachers"
  | "stats-absences"
  | "recent-payments"
  | "recent-absences"
  | "upcoming-events"
  | "payment-chart"
  | "attendance-chart"
  | "class-distribution"
  | "alerts-summary"
  | "quick-actions";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description: string;
  icon: string;
  category: "stats" | "lists" | "charts" | "actions";
}

export interface DashboardLayout {
  i: string; // widget id
  x: number;
  y: number;
  w: number; // width in grid units
  h: number; // height in grid units
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DashboardConfig {
  layout: DashboardLayout[];
  activeWidgets: string[];
}
