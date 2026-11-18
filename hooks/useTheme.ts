"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "nextjs-todo-app:theme";

/** The initial class is set by an inline script in layout.tsx; here we just read it back. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setTheme(next);
  }, []);

  return { theme, toggle };
}
