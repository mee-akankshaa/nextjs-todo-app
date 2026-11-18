import type { Todo, TodoDraft } from "./types";

export type TodoAction =
  | { type: "hydrate"; todos: Todo[] }
  | { type: "add"; draft: TodoDraft; id: string; now: number }
  | { type: "update"; id: string; changes: Partial<TodoDraft> }
  | { type: "toggle"; id: string }
  | { type: "delete"; id: string }
  | { type: "clearCompleted" };

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "hydrate":
      return action.todos;
    case "add": {
      const title = action.draft.title.trim();
      if (!title) return state;
      const todo: Todo = {
        id: action.id,
        title,
        completed: false,
        priority: action.draft.priority,
        dueDate: action.draft.dueDate,
        createdAt: action.now,
      };
      return [todo, ...state];
    }
    case "update":
      return state.map((t) => {
        if (t.id !== action.id) return t;
        const title = action.changes.title?.trim();
        return {
          ...t,
          ...action.changes,
          title: title ? title : t.title,
        };
      });
    case "toggle":
      return state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t));
    case "delete":
      return state.filter((t) => t.id !== action.id);
    case "clearCompleted":
      return state.filter((t) => !t.completed);
    default:
      return state;
  }
}
