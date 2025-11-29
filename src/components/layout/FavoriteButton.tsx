import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesContext } from "@/contexts/FavoritesContext";
import { useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface FavoriteButtonProps {
  title: string;
}

export function FavoriteButton({ title }: FavoriteButtonProps) {
  const location = useLocation();
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const currentPath = location.pathname;
  const isFav = isFavorite(currentPath);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite({ path: currentPath, title })}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
      </TooltipContent>
    </Tooltip>
  );
}
