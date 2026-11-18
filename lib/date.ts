/** Local-time "YYYY-MM-DD". Avoids toISOString(), which shifts the day via UTC. */
export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isOverdue(dueDate: string | null, completed: boolean, today: string): boolean {
  return !!dueDate && !completed && dueDate < today;
}

/** Formats a "YYYY-MM-DD" string without Date parsing (which would treat it as UTC). */
export function formatDue(dueDate: string): string {
  const [y, m, d] = dueDate.split("-").map(Number);
  if (!y || !m || !d) return dueDate;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
