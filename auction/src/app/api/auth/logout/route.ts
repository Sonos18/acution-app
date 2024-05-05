import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 401,
      }
    );
  }
  try {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return Response.json({
      status: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    return Response.json(
      { message: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}
