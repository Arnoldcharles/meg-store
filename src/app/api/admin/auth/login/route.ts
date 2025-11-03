import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;

    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "arnoldcharles028@gmail.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MegStoreDev";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set a simple client-visible cookie for admin session (dev use). Max-Age 7 days
      const res = NextResponse.json({ success: true });
      res.headers.set("Set-Cookie", `is_admin=1; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`);
      return res;
    }
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
