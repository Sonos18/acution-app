export async function POST(request: Request) {
  const body = await request.json();
  const accessToken = body.accessToken as string;
  const refreshToken = body.refreshToken as string;
  const role = body.role as string;
  if (!accessToken) {
    return Response.json(
      { message: "Không nhận được token" },
      {
        status: 400,
      }
    );
  }
  const res = Response.json(body, {
    status: 200,
    headers: {
      "Set-Cookie": `accessToken=${accessToken}; Path=/; HttpOnly,refreshToken=${refreshToken}; Path=/; HttpOnly,role=${role}; Path=/; HttpOnly`,
    },
  });
  return res;
}
