// app/api/set-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token;
    console.log("TOKEN SET COOKIE >> ",token);
    

    if (!token) {
      throw { status: 400, message: "token is required" };
    }

    const decoded = jwtDecode<any>(token);
    const unix = new Date().getTime() / 1000;

    if (decoded.exp < unix) {
      throw { status: 400, message: "token is expired" };
    }

    const response = NextResponse.json({ message: `Cookie set` });

    // TODO - 1.3 assign token into cache named auth_token
    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=86400`
    );

    const tokenCache = new Map()
    tokenCache.set("auth_token", token);
    console.log("Cache: ", tokenCache);
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || error },
      { status: error.status || 500, statusText: error.message || error } // Bad Request
    );
  }
}
