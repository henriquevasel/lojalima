import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const decoded: any = verifyToken(token);

  if (!decoded || !decoded.userId) {
    throw new Error("INVALID_TOKEN");
  }

  return decoded.userId;
}