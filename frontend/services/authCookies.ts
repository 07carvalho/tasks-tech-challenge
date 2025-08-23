"use server";
import { cookies } from "next/headers";

export async function getAuthTokens() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const headerType = cookieStore.get("header_type")?.value;
  return { accessToken, headerType };
};
