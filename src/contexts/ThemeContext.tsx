import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  primary: string;
  accent: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colors: ThemeColors;
}

const defaultColors: ThemeColors = {
  primary: "217 91% 60%", // Blue
  accent: "217 91% 60%",
};

const colorPresets = [
  { name: "Bleu", primary: "217 91% 60%", accent: "217 91% 60%" },
  { name: "Violet", primary: "271 81% 56%", accent: "271 81% 56%" },
  { name: "Vert", primary: "142 71% 45%", accent: "142 71% 45%" },
  { name: "Orange", primary: "25 95% 53%", accent: "25 95% 53%" },
  { name: "Rose", primary: "340 82% 52%", accent: "340 82% 52%" },
  { name: "Cyan", primary: "197 71% 52%", accent: "197 71% 52%" },
  { name: "Indigo", primary: "239 84% 67%", accent: "239 84% 67%" },
  { name: "Émeraude", primary: "160 84% 39%", accent: "160 84% 39%" },
];

interface ThemeContextType {
  theme: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setColors: (colors: ThemeColors) => void;
  colorPresets: typeof colorPresets;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "app-theme-config";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { mode: "system" as ThemeMode, colors: defaultColors };
      }
    }
    return { mode: "system" as ThemeMode, colors: defaultColors };
  });

  // Apply theme mode
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme.mode === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(systemDark ? "dark" : "light");
    } else {
      root.classList.add(theme.mode);
    }
  }, [theme.mode]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme.mode]);

  // Apply custom colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.colors.primary);
    root.style.setProperty("--accent", theme.colors.accent);
    root.style.setProperty("--ring", theme.colors.primary);
    root.style.setProperty("--sidebar-primary", theme.colors.primary);
    root.style.setProperty("--sidebar-ring", theme.colors.primary);
    root.style.setProperty("--chart-1", theme.colors.primary);
    root.style.setProperty("--stat-icon-color", theme.colors.primary);
  }, [theme.colors]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  }, [theme]);

  const setMode = (mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }));
  };

  const setColors = (colors: ThemeColors) => {
    setTheme((prev) => ({ ...prev, colors }));
  };

  const resetToDefaults = () => {
    setTheme({ mode: "system", colors: defaultColors });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setMode,
        setColors,
        colorPresets,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
