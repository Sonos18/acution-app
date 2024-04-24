export async function POST(request: Request) {
  const body = await request.json();
  const accessToken = body.accessToken as string;
  const refreshToken = body.refreshToken as string;
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
      "Set-Cookie": `accessToken=${accessToken}; Path=/; HttpOnly,refreshToken=${refreshToken}; Path=/; HttpOnly`,
    },
  });
  return res;
}

export async function UPDATE(request: Request) {
  const body = await request.json();
  const accessToken = body.accessToken as string;
  if (!accessToken) {
    return Response.json(
      { message: "Không nhận được token" },
      {
        status: 400,
      }
    );
  }
  return Response.json(body, {
    status: 200,
    headers: {
      "Set-Cookie": `accessToken=${accessToken}; Path=/; HttpOnly`,
    },
  });
}
