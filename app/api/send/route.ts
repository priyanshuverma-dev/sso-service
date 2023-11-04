import { HelloEmail } from "@/email-template/hello";
import { BASE, resend } from "@/lib/core";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
export const EMAIL_API_ROUTE = `${BASE}/api/send`;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const { name, email } = payload;
    const { data, error } = await resend.emails.send({
      from: "GateSync <hi@gatesync.p7u.tech>",
      to: [email],
      subject: "Hi, Thanks for registering youself!",
      react: HelloEmail({ firstName: name }) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
