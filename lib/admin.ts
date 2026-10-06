import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function requireAdminApi() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          error: "Unauthorized",
          message: "Login diperlukan.",
        },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json(
        {
          error: "Forbidden",
          message: "Akses admin diperlukan.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}