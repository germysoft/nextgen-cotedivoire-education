import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

interface ListWidgetProps {
  items: ListItem[];
  emptyMessage?: string;
}

export function ListWidget({ items, emptyMessage = "Aucun élément" }: ListWidgetProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.title}</p>
              {item.subtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.subtitle}
                </p>
              )}
            </div>
            {item.badge && <div className="flex-shrink-0">{item.badge}</div>}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
