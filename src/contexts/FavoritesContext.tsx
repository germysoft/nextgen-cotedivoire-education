import { createContext, useContext, ReactNode } from "react";
import { useFavorites, Favorite } from "@/hooks/useFavorites";

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
  toggleFavorite: (favorite: Favorite) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoritesData = useFavorites();

  return (
    <FavoritesContext.Provider value={favoritesData}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return context;
}
