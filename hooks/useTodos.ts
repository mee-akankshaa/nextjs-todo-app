"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { todoReducer } from "@/lib/todoReducer";
import { countTodos, filterTodos, sortTodos } from "@/lib/todoSelectors";
import { loadTodos, saveTodos } from "@/lib/storage";
import type { Filter, TodoDraft } from "@/lib/types";

export function useTodos() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  // Load after mount so server and first client render match (no hydration mismatch).
  useEffect(() => {
    dispatch({ type: "hydrate", todos: loadTodos() });
    setHydrated(true);
  }, []);

  // Only persist once hydrated, otherwise the empty initial state would wipe saved data.
  useEffect(() => {
    if (hydrated) saveTodos(todos);
  }, [todos, hydrated]);

  const add = useCallback(
    (draft: TodoDraft) =>
      dispatch({ type: "add", draft, id: crypto.randomUUID(), now: Date.now() }),
    [],
  );
  const update = useCallback(
    (id: string, changes: Partial<TodoDraft>) => dispatch({ type: "update", id, changes }),
    [],
  );
  const toggle = useCallback((id: string) => dispatch({ type: "toggle", id }), []);
  const remove = useCallback((id: string) => dispatch({ type: "delete", id }), []);
  const clearCompleted = useCallback(() => dispatch({ type: "clearCompleted" }), []);

  const visible = useMemo(() => sortTodos(filterTodos(todos, filter, query)), [todos, filter, query]);
  const counts = useMemo(() => countTodos(todos), [todos]);

  return {
    hydrated, todos, visible, counts,
    filter, setFilter, query, setQuery,
    add, update, toggle, remove, clearCompleted,
  };
}
