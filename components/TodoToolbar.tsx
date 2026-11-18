"use client";

import type { Filter } from "@/lib/types";
import { fieldClass } from "./TodoForm";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

interface Props {
  filter: Filter;
  onFilter: (f: Filter) => void;
  query: string;
  onQuery: (q: string) => void;
  counts: { all: number; active: number; done: number };
  onClearCompleted: () => void;
}

export default function TodoToolbar({ filter, onFilter, query, onQuery, counts, onClearCompleted }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="search" className="sr-only">Search tasks</label>
        <input id="search" type="search" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search tasks..." className={`${fieldClass} w-full`} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="group" aria-label="Filter tasks" className="inline-flex rounded-lg border border-slate-300 p-0.5 dark:border-slate-700">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => onFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                filter === f.value
                  ? "bg-indigo-600 text-white"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {f.label} <span className="opacity-80">({counts[f.value === "done" ? "done" : f.value]})</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClearCompleted}
          disabled={counts.done === 0}
          className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Clear completed
        </button>
      </div>
    </div>
  );
}
