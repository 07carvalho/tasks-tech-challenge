"use server";
import { cookies } from "next/headers";

type LoginData = {
  email: string;
  password: string;
}

export type LoginErrorResponse = {
  [key: string]: string[];
};

export type LoginResponse = {
  success: boolean;
  errors?: LoginErrorResponse;
};

export async function login(data: LoginData): Promise<LoginResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      let errorBody: unknown;
      try {
        errorBody = await res.json();
      } catch {
        throw new Error("Unexpected error from server.");
      }

      if (typeof errorBody === "object" && errorBody !== null) {
        return { success: false, errors: errorBody as LoginErrorResponse };
      }

      throw new Error(`Unexpected error: ${res.status}`);
    }

    const result = await res.json();
    const { header_type, access_token, refresh_token } = result;

    const nextCookies = await cookies();
    nextCookies.set("header_type", header_type, { path: "/", httpOnly: false, sameSite: "strict" });
    nextCookies.set("access_token", access_token, { path: "/", httpOnly: false, sameSite: "strict" });
    nextCookies.set("refresh_token", refresh_token, { path: "/", httpOnly: false, sameSite: "strict" });

    return { success: true };
  } catch (err) {
    console.error("Login error:", err);
    return {
      success: false,
      errors: { non_field_errors: ["Failed to log in. Please try again."] },
    };
  }
}
