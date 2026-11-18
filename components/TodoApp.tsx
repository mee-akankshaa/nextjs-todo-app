"use client";

import { useTodos } from "@/hooks/useTodos";
import ThemeToggle from "./ThemeToggle";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import TodoToolbar from "./TodoToolbar";

export default function TodoApp() {
  const t = useTodos();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
            {t.hydrated ? `${t.counts.active} active, ${t.counts.done} done` : "Loading..."}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className="space-y-5">
        <TodoForm onAdd={t.add} />
        <TodoToolbar
          filter={t.filter}
          onFilter={t.setFilter}
          query={t.query}
          onQuery={t.setQuery}
          counts={t.counts}
          onClearCompleted={t.clearCompleted}
        />
        {t.hydrated && (
          <TodoList
            todos={t.visible}
            total={t.todos.length}
            filter={t.filter}
            query={t.query}
            onToggle={t.toggle}
            onDelete={t.remove}
            onUpdate={t.update}
          />
        )}
      </div>
    </main>
  );
}
