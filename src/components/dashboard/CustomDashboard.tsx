import { useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { WidgetRenderer } from "./WidgetRenderer";
import { WidgetSelector } from "./WidgetSelector";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Lock, Unlock } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function CustomDashboard() {
  const { config, updateLayout, addWidget, removeWidget, resetToDefault } =
    useDashboardConfig();
  const [isLocked, setIsLocked] = useState(false);

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (!isLocked) {
      const updatedLayout = newLayout.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH,
      }));
      updateLayout(updatedLayout);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tableau de Bord Personnalisé
            </h1>
            <p className="text-muted-foreground">
              Organisez vos widgets selon vos préférences
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLocked ? "default" : "outline"}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Verrouillé
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Déverrouillé
              </>
            )}
          </Button>
          <WidgetSelector
            activeWidgets={config.activeWidgets}
            onAddWidget={addWidget}
            onRemoveWidget={removeWidget}
            onReset={resetToDefault}
          />
        </div>
      </div>

      {config.activeWidgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-lg">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucun widget configuré
          </h3>
          <p className="text-muted-foreground mb-4">
            Ajoutez des widgets pour personnaliser votre tableau de bord
          </p>
          <WidgetSelector
            activeWidgets={config.activeWidgets}
            onAddWidget={addWidget}
            onRemoveWidget={removeWidget}
            onReset={resetToDefault}
          />
        </div>
      ) : (
        <div className="relative">
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: config.layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={handleLayoutChange}
            isDraggable={!isLocked}
            isResizable={!isLocked}
            compactType="vertical"
            preventCollision={false}
          >
            {config.layout.map((layoutItem) => (
              <div
                key={layoutItem.i}
                className="animate-fade-in"
              >
                <WidgetRenderer
                  type={layoutItem.i as any}
                  onRemove={() => removeWidget(layoutItem.i)}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      )}
    </div>
  );
}
