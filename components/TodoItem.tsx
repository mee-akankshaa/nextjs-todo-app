"use client";

import { useState, type FormEvent } from "react";
import { formatDue, isOverdue, todayISO } from "@/lib/date";
import { PRIORITIES, PRIORITY_LABEL, type Priority, type Todo, type TodoDraft } from "@/lib/types";
import { fieldClass } from "./TodoForm";

const badge: Record<Priority, string> = {
  low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  high: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<TodoDraft>) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [dueDate, setDueDate] = useState(todo.dueDate ?? "");

  const overdue = isOverdue(todo.dueDate, todo.completed, todayISO());

  function startEdit() {
    setTitle(todo.title);
    setPriority(todo.priority);
    setDueDate(todo.dueDate ?? "");
    setEditing(true);
  }

  function save(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onUpdate(todo.id, { title, priority, dueDate: dueDate || null });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="rounded-xl border border-indigo-300 bg-white p-3 dark:border-indigo-700 dark:bg-slate-900">
        <form onSubmit={save} onKeyDown={(e) => e.key === "Escape" && setEditing(false)} className="flex flex-wrap items-end gap-2">
          <div className="min-w-[12rem] flex-1">
            <label htmlFor={`t-${todo.id}`} className="sr-only">Task title</label>
            <input id={`t-${todo.id}`} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className={`${fieldClass} w-full`} />
          </div>
          <div>
            <label htmlFor={`p-${todo.id}`} className="sr-only">Priority</label>
            <select id={`p-${todo.id}`} value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={fieldClass}>
              {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`d-${todo.id}`} className="sr-only">Due date</label>
            <input id={`d-${todo.id}`} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={fieldClass} />
          </div>
          <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save</button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <input
        id={`c-${todo.id}`}
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-indigo-600"
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={`c-${todo.id}`} className={`block cursor-pointer break-words ${todo.completed ? "text-slate-500 line-through dark:text-slate-400" : ""}`}>
          {todo.title}
        </label>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-2 py-0.5 font-medium ${badge[todo.priority]}`}>{PRIORITY_LABEL[todo.priority]}</span>
          {todo.dueDate && (
            <span className={overdue ? "font-semibold text-red-700 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}>
              {overdue ? "Overdue: " : "Due "}
              {formatDue(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button type="button" onClick={startEdit} aria-label={`Edit ${todo.title}`} className="rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Edit</button>
        <button type="button" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`} className="rounded-lg px-2 py-1 text-sm text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950">Delete</button>
      </div>
    </li>
  );
}
