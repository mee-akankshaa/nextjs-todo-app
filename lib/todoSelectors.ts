import type { Filter, Todo } from "./types";

const WEIGHT = { high: 0, medium: 1, low: 2 } as const;

export function filterTodos(todos: Todo[], filter: Filter, query: string): Todo[] {
  const q = query.trim().toLowerCase();
  return todos
    .filter((t) => (filter === "active" ? !t.completed : filter === "done" ? t.completed : true))
    .filter((t) => (q ? t.title.toLowerCase().includes(q) : true));
}

/** Incomplete first, then by priority, then by due date (undated last), then newest. */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (WEIGHT[a.priority] !== WEIGHT[b.priority]) return WEIGHT[a.priority] - WEIGHT[b.priority];
    if (a.dueDate !== b.dueDate) {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate < b.dueDate ? -1 : 1;
    }
    return b.createdAt - a.createdAt;
  });
}

export function countTodos(todos: Todo[]) {
  const done = todos.filter((t) => t.completed).length;
  return { all: todos.length, done, active: todos.length - done };
}
