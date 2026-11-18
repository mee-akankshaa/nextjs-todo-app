import type { Priority, Todo } from "./types";

export const STORAGE_KEY = "nextjs-todo-app:todos:v1";
const PRIORITIES = ["low", "medium", "high"];

function isTodo(x: unknown): x is Todo {
  if (typeof x !== "object" || x === null) return false;
  const t = x as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.completed === "boolean" &&
    typeof t.createdAt === "number" &&
    PRIORITIES.includes(t.priority as Priority) &&
    (t.dueDate === null || typeof t.dueDate === "string")
  );
}

export function parseTodos(raw: string | null): Todo[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isTodo) : [];
  } catch {
    return [];
  }
}

export function loadTodos(): Todo[] {
  try {
    return parseTodos(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    /* storage full or blocked: app keeps working in memory */
  }
}
