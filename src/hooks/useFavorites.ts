import { useState, useEffect } from "react";

export interface Favorite {
  path: string;
  title: string;
  icon?: string;
}

const FAVORITES_KEY = "app_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (favorite: Favorite) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.path === favorite.path)) {
        return prev;
      }
      return [...prev, favorite];
    });
  };

  const removeFavorite = (path: string) => {
    setFavorites((prev) => prev.filter((f) => f.path !== path));
  };

  const isFavorite = (path: string) => {
    return favorites.some((f) => f.path === path);
  };

  const toggleFavorite = (favorite: Favorite) => {
    if (isFavorite(favorite.path)) {
      removeFavorite(favorite.path);
    } else {
      addFavorite(favorite);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
