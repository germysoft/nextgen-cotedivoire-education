import { useState } from "react";
import { useTheme, ThemeMode } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sun, Moon, Monitor, Palette, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme, setMode, setColors, colorPresets, resetToDefaults } = useTheme();
  const [showColorDialog, setShowColorDialog] = useState(false);

  const modeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const getCurrentIcon = () => {
    if (theme.mode === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemDark ? Moon : Sun;
    }
    return modeIcons[theme.mode];
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <CurrentIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Mode d'affichage</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setMode("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Clair
            {theme.mode === "light" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Sombre
            {theme.mode === "dark" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            Système
            {theme.mode === "system" && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowColorDialog(true)}>
            <Palette className="mr-2 h-4 w-4" />
            Personnaliser les couleurs
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showColorDialog} onOpenChange={setShowColorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Personnalisation du thème</DialogTitle>
            <DialogDescription>
              Choisissez une couleur principale pour personnaliser l'apparence de l'application.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Couleurs prédéfinies</h4>
              <div className="grid grid-cols-4 gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setColors({ primary: preset.primary, accent: preset.accent })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105",
                      theme.colors.primary === preset.primary
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-muted hover:bg-muted/80"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-full shadow-md"
                      style={{ backgroundColor: `hsl(${preset.primary})` }}
                    />
                    <span className="text-xs font-medium">{preset.name}</span>
                    {theme.colors.primary === preset.primary && (
                      <Check className="h-3 w-3 text-primary absolute top-1 right-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Aperçu</h4>
              <div className="p-4 rounded-lg border bg-card space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-primary" />
                  <span className="text-sm">Couleur principale</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Bouton primaire</Button>
                  <Button size="sm" variant="secondary">Secondaire</Button>
                  <Button size="sm" variant="outline">Outline</Button>
                </div>
                <div className="h-2 rounded-full bg-primary/30">
                  <div className="h-2 rounded-full bg-primary w-2/3" />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button size="sm" onClick={() => setShowColorDialog(false)}>
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
