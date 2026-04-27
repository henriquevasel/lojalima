import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendResetEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 🔥 não revela se existe ou não
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  const link = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

  await sendResetEmail(email, link);

  return NextResponse.json({ success: true });
}