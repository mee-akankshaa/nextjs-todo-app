import { describe, expect, it } from "vitest";
import { todoReducer } from "./todoReducer";
import { countTodos, filterTodos, sortTodos } from "./todoSelectors";
import { parseTodos } from "./storage";
import { isOverdue, todayISO } from "./date";
import type { Todo } from "./types";

const mk = (o: Partial<Todo> = {}): Todo => ({
  id: "1", title: "Task", completed: false, priority: "medium", dueDate: null, createdAt: 1, ...o,
});

describe("todoReducer", () => {
  it("adds a trimmed todo at the top and ignores blank titles", () => {
    const s1 = todoReducer([], { type: "add", draft: { title: "  Buy milk ", priority: "high", dueDate: null }, id: "a", now: 5 });
    expect(s1).toHaveLength(1);
    expect(s1[0]).toMatchObject({ id: "a", title: "Buy milk", priority: "high", completed: false });
    expect(todoReducer(s1, { type: "add", draft: { title: "   ", priority: "low", dueDate: null }, id: "b", now: 6 })).toBe(s1);
  });

  it("toggles, updates (keeping old title if blank) and deletes", () => {
    let s = [mk()];
    s = todoReducer(s, { type: "toggle", id: "1" });
    expect(s[0]?.completed).toBe(true);
    s = todoReducer(s, { type: "update", id: "1", changes: { title: "  ", priority: "low" } });
    expect(s[0]).toMatchObject({ title: "Task", priority: "low" });
    s = todoReducer(s, { type: "delete", id: "1" });
    expect(s).toEqual([]);
  });

  it("clears only completed todos", () => {
    const s = todoReducer([mk({ id: "1", completed: true }), mk({ id: "2" })], { type: "clearCompleted" });
    expect(s.map((t) => t.id)).toEqual(["2"]);
  });
});

describe("selectors", () => {
  const todos = [
    mk({ id: "1", title: "Write report", completed: true }),
    mk({ id: "2", title: "Call mom", priority: "low" }),
    mk({ id: "3", title: "Pay rent", priority: "high", dueDate: "2026-01-02" }),
  ];
  it("filters by status and search", () => {
    expect(filterTodos(todos, "active", "").map((t) => t.id)).toEqual(["2", "3"]);
    expect(filterTodos(todos, "done", "").map((t) => t.id)).toEqual(["1"]);
    expect(filterTodos(todos, "all", "RENT").map((t) => t.id)).toEqual(["3"]);
  });
  it("sorts active first, then by priority", () => {
    expect(sortTodos(todos).map((t) => t.id)).toEqual(["3", "2", "1"]);
  });
  it("counts", () => {
    expect(countTodos(todos)).toEqual({ all: 3, done: 1, active: 2 });
  });
});

describe("storage and dates", () => {
  it("parses safely and drops invalid entries", () => {
    expect(parseTodos(null)).toEqual([]);
    expect(parseTodos("not json")).toEqual([]);
    expect(parseTodos(JSON.stringify([mk(), { id: 1 }]))).toHaveLength(1);
  });
  it("formats local dates and detects overdue", () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(isOverdue("2026-01-04", false, "2026-01-05")).toBe(true);
    expect(isOverdue("2026-01-04", true, "2026-01-05")).toBe(false);
    expect(isOverdue(null, false, "2026-01-05")).toBe(false);
  });
});
