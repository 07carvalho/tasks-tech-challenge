"use server";

import { cookies } from "next/headers";

export type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type SignupErrorResponse = {
  [key: string]: string[];
};

export type SignupResponse = {
  success: boolean;
  errors?: SignupErrorResponse;
};

export async function signup(data: SignupPayload): Promise<SignupResponse> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        return { success: false, errors: errorBody as SignupErrorResponse };
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
    return {
      success: false,
      errors: { non_field_errors: ["Failed to sign up. Please try again."] },
    };
  }
}
