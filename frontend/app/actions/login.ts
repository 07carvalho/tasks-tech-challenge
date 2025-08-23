"use server";
import { cookies } from "next/headers";

type LoginData = {
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const result = await res.json();
  const { header_type, access_token, refresh_token } = result;

  const nextCookies = await cookies();
  nextCookies.set("header_type", header_type, { path: "/", httpOnly: false, sameSite: "strict" });
  nextCookies.set("access_token", access_token, { path: "/", httpOnly: false, sameSite: "strict" });
  nextCookies.set("refresh_token", refresh_token, { path: "/", httpOnly: false, sameSite: "strict" });

  return result;
}
