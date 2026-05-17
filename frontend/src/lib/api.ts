const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type TodoStatus = "pending" | "in_progress" | "completed";

export type Todo = {
  id: number;
  title: string;
  status: TodoStatus;
  created_at: string;
  updated_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export function listTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos");
}

export function createTodo(title: string): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify({ title, status: "pending" }),
  });
}

export function updateTodo(
  id: number,
  data: Partial<Pick<Todo, "title" | "status">>,
): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return request<void>(`/todos/${id}`, { method: "DELETE" });
}
