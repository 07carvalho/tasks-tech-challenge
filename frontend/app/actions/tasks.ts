"use server";
import { getAuthTokens } from "@/services/authCookies";

export type CreateTaskPayload = {
  title: string;
  description: string;
  status: "P" | "I" | "C";
  due_date: string;
}

export type Task = CreateTaskPayload & {
  id: number;
  created_at: string;
};

export type TaskResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export async function getTasks(): Promise<Task[]> {
  const { accessToken, headerType } = await getAuthTokens();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${headerType} ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return await res.json();
}

export async function createTask(data: CreateTaskPayload): Promise<Task> {
  const { accessToken, headerType } = await getAuthTokens();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${headerType} ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return await res.json();
}
