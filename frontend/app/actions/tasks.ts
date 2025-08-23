"use server";
import { getAuthTokens } from "@/services/authCookies";

export type Task = {
  id: number;
  title: string;
  description: string;
  due_date: string;
}

export type TaskResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export async function getTasks(page: number = 1): Promise<TaskResponse> {
  const { accessToken, headerType } = await getAuthTokens();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tasks?page=${page}`, {
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
