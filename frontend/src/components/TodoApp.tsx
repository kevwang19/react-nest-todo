"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  createTodo,
  deleteTodo,
  listTodos,
  Todo,
  TodoStatus,
  updateTodo,
} from "@/lib/api";
import {
  countByStatus,
  formatDateTime,
  STATUS_STYLES,
  TODO_STATUSES,
} from "@/lib/todo-ui";

const interactive =
  "cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await listTodos();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await createTodo(trimmed);
      setTodos((prev) => [created, ...prev]);
      setTitle("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create todo");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(todo: Todo, status: TodoStatus) {
    if (status === todo.status) return;

    setUpdatingId(todo.id);
    setError(null);
    try {
      const updated = await updateTodo(todo.id, { status });
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete todo");
    } finally {
      setDeletingId(null);
    }
  }

  const counts = countByStatus(todos);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Todo manager
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Next.js + NestJS + TypeORM + SQLite
        </p>
      </header>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {TODO_STATUSES.map(({ value, label }) => (
          <div
            key={value}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${STATUS_STYLES[value].dot}`}
                aria-hidden
              />
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {label}
              </p>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {counts[value]}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <label htmlFor="new-todo" className="sr-only">
          New todo name
        </label>
        <input
          id="new-todo"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-zinc-900 outline-none ring-violet-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className={`rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white hover:bg-violet-500 ${interactive}`}
        >
          {submitting ? "Adding…" : "Add task"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {error}
          <span className="mt-1 block text-red-600 dark:text-red-300">
            Is the Nest API running on port 8000? (
            <code className="text-xs">npm run start:dev</code> in{" "}
            <code className="text-xs">backend/</code>)
          </span>
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            Loading todos…
          </p>
        ) : todos.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            No todos yet. Add your first task above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Last modified</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {todos.map((todo) => {
                  const isCompleted = todo.status === "completed";
                  const isUpdating = updatingId === todo.id;
                  const isDeleting = deletingId === todo.id;

                  return (
                    <tr
                      key={todo.id}
                      className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        #{todo.id}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${
                            isCompleted
                              ? "text-zinc-400 line-through"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {todo.title}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <span
                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[todo.status].badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLES[todo.status].dot}`}
                              aria-hidden
                            />
                            {
                              TODO_STATUSES.find((s) => s.value === todo.status)
                                ?.label
                            }
                          </span>
                          <select
                            value={todo.status}
                            onChange={(e) =>
                              handleStatusChange(
                                todo,
                                e.target.value as TodoStatus,
                              )
                            }
                            disabled={isUpdating}
                            aria-label={`Change status for ${todo.title}`}
                            className={`rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 ${interactive}`}
                          >
                            {TODO_STATUSES.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        <time dateTime={todo.created_at}>
                          {formatDateTime(todo.created_at)}
                        </time>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        <time dateTime={todo.updated_at}>
                          {formatDateTime(todo.updated_at)}
                        </time>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(todo.id)}
                          disabled={isDeleting}
                          aria-label={`Delete ${todo.title}`}
                          className={`rounded-md px-2.5 py-1 text-xs font-medium text-zinc-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300 ${interactive}`}
                        >
                          {isDeleting ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
