"use client";

import { useState, type FormEvent } from "react";
import { PRIORITIES, PRIORITY_LABEL, type Priority, type TodoDraft } from "@/lib/types";

export const fieldClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export default function TodoForm({ onAdd }: { onAdd: (draft: TodoDraft) => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    onAdd({ title, priority, dueDate: dueDate || null });
    setTitle("");
    setDueDate("");
    setError("");
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" noValidate>
      <div>
        <label htmlFor="new-title" className="mb-1 block text-sm font-medium">New task</label>
        <input
          id="new-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (error) setError(""); }}
          maxLength={200}
          placeholder="What needs doing?"
          aria-invalid={!!error}
          aria-describedby={error ? "new-title-error" : undefined}
          className={`${fieldClass} w-full`}
        />
        {error && <p id="new-title-error" role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="new-priority" className="mb-1 block text-sm font-medium">Priority</label>
          <select id="new-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={fieldClass}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="new-due" className="mb-1 block text-sm font-medium">Due date</label>
          <input id="new-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={fieldClass} />
        </div>
        <button type="submit" className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Add task
        </button>
      </div>
    </form>
  );
}
