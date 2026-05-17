import type { Todo, TodoStatus } from "@/lib/api";

export const TODO_STATUSES: {
  value: TodoStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export const STATUS_STYLES: Record<
  TodoStatus,
  { badge: string; dot: string }
> = {
  pending: {
    badge:
      "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800",
    dot: "bg-amber-500",
  },
  in_progress: {
    badge:
      "bg-sky-50 text-sky-800 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-800",
    dot: "bg-sky-500",
  },
  completed: {
    badge:
      "bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800",
    dot: "bg-emerald-500",
  },
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function countByStatus(todos: Todo[]): Record<TodoStatus, number> {
  return todos.reduce(
    (acc, todo) => {
      acc[todo.status] += 1;
      return acc;
    },
    { pending: 0, in_progress: 0, completed: 0 } satisfies Record<
      TodoStatus,
      number
    >,
  );
}
