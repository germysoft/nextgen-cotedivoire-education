import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";

interface WidgetContainerProps {
  title: string;
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
}

export function WidgetContainer({
  title,
  children,
  onRemove,
  className = "",
}: WidgetContainerProps) {
  return (
    <Card className={`flex flex-col h-full overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </Card>
  );
}
