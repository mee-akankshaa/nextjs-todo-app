import type { Filter, Todo, TodoDraft } from "@/lib/types";
import TodoItem from "./TodoItem";

interface Props {
  todos: Todo[];
  total: number;
  filter: Filter;
  query: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<TodoDraft>) => void;
}

export default function TodoList({ todos, total, filter, query, ...handlers }: Props) {
  if (todos.length === 0) {
    const message =
      total === 0
        ? { h: "No tasks yet", p: "Add your first task above to get started." }
        : query.trim()
          ? { h: "No matches", p: `Nothing matches "${query.trim()}".` }
          : filter === "done"
            ? { h: "Nothing completed yet", p: "Finish a task and it will show up here." }
            : { h: "All caught up", p: "No active tasks left. Nice work." };
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
        <p className="font-semibold">{message.h}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{message.p}</p>
      </div>
    );
  }
  return (
    <ul className="space-y-2" aria-label="Tasks">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} {...handlers} />
      ))}
    </ul>
  );
}
