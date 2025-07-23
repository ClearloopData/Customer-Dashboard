import { NextResponse } from "next/server";

export async function GET() {
  try {
    const email = process.env.SHARED_ACCESS_EMAIL;
    const password = process.env.SHARED_ACCESS_PASSWORD;

    if (!email || !password) {
      console.error("Missing shared email or password in environment");
      return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
    }

    return NextResponse.json({ email, password });
  } catch (error) {
    console.error("Shared DB login failed:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
