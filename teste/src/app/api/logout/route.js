import { NextResponse } from "next/server";

export async function POST(req) {
  const response = NextResponse.json({
    message: "Logout realizado com sucesso",
  });
  response.cookies.set("token", "", { expires: new Date(0), path: "/" });
  return response;
}
