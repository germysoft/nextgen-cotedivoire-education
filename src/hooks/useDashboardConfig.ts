import { useState, useEffect } from "react";
import { DashboardConfig, DashboardLayout } from "@/types/dashboard";

const STORAGE_KEY = "dashboard_config";

const DEFAULT_CONFIG: DashboardConfig = {
  layout: [
    { i: "stats-students", x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: "stats-payments", x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: "stats-teachers", x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: "stats-absences", x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: "payment-chart", x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "attendance-chart", x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: "recent-payments", x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
    { i: "recent-absences", x: 4, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
    { i: "alerts-summary", x: 8, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  ],
  activeWidgets: [
    "stats-students",
    "stats-payments",
    "stats-teachers",
    "stats-absences",
    "payment-chart",
    "attendance-chart",
    "recent-payments",
    "recent-absences",
    "alerts-summary",
  ],
};

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateLayout = (newLayout: DashboardLayout[]) => {
    setConfig((prev) => ({ ...prev, layout: newLayout }));
  };

  const addWidget = (widgetId: string) => {
    if (config.activeWidgets.includes(widgetId)) return;

    const newWidget: DashboardLayout = {
      i: widgetId,
      x: 0,
      y: Infinity, // Places at bottom
      w: 4,
      h: 3,
      minW: 2,
      minH: 2,
    };

    setConfig((prev) => ({
      layout: [...prev.layout, newWidget],
      activeWidgets: [...prev.activeWidgets, widgetId],
    }));
  };

  const removeWidget = (widgetId: string) => {
    setConfig((prev) => ({
      layout: prev.layout.filter((item) => item.i !== widgetId),
      activeWidgets: prev.activeWidgets.filter((id) => id !== widgetId),
    }));
  };

  const resetToDefault = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    updateLayout,
    addWidget,
    removeWidget,
    resetToDefault,
  };
}
