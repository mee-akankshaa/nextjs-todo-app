export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "done";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  /** Calendar date as "YYYY-MM-DD", or null when no due date. */
  dueDate: string | null;
  createdAt: number;
}

export interface TodoDraft {
  title: string;
  priority: Priority;
  dueDate: string | null;
}

export const PRIORITIES: readonly Priority[] = ["low", "medium", "high"];
export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
