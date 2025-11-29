import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { availableWidgets } from "@/data/availableWidgets";
import { Settings, Plus, Search, Check } from "lucide-react";
import * as Icons from "lucide-react";

interface WidgetSelectorProps {
  activeWidgets: string[];
  onAddWidget: (widgetId: string) => void;
  onRemoveWidget: (widgetId: string) => void;
  onReset: () => void;
}

export function WidgetSelector({
  activeWidgets,
  onAddWidget,
  onRemoveWidget,
  onReset,
}: WidgetSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredWidgets = availableWidgets.filter((widget) => {
    const matchesSearch =
      widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || widget.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "Tous" },
    { value: "stats", label: "Statistiques" },
    { value: "charts", label: "Graphiques" },
    { value: "lists", label: "Listes" },
    { value: "actions", label: "Actions" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Configurer les Widgets
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Configuration du Tableau de Bord</DialogTitle>
          <DialogDescription>
            Ajoutez ou retirez des widgets pour personnaliser votre tableau de
            bord
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un widget..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={onReset}>
              Réinitialiser
            </Button>
          </div>

          <Tabs
            defaultValue="all"
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="w-full">
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="flex-1">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid gap-3">
                  {filteredWidgets.map((widget) => {
                    const isActive = activeWidgets.includes(widget.id);
                    const IconComponent = Icons[widget.icon as keyof typeof Icons] as any;

                    return (
                      <div
                        key={widget.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                          isActive ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {IconComponent && (
                            <div className="p-2 rounded-lg bg-primary/10">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">{widget.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {widget.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {widget.category}
                        </Badge>
                        <Button
                          size="sm"
                          variant={isActive ? "secondary" : "default"}
                          onClick={() =>
                            isActive
                              ? onRemoveWidget(widget.id)
                              : onAddWidget(widget.id)
                          }
                        >
                          {isActive ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Activé
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Ajouter
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
