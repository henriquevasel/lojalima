import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import crypto from "crypto";

const BASE_URL = "https://lojalimaelima.com.br";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        `${BASE_URL}/login?error=missing_token`
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: hashedToken,
        emailVerifyExpires: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.redirect(
        `${BASE_URL}/login?error=invalid_token`
      );
    }

    if (user.emailVerified) {
      return NextResponse.redirect(
        `${BASE_URL}/login?alreadyVerified=true`
      );
    }

  await prisma.user.update({
  where: { id: user.id },
  data: {
    emailVerified: true,
    emailVerifiedAt: new Date(), // <-- NOVO
    emailVerifyToken: null,
    emailVerifyExpires: null,
  },
});

    return NextResponse.redirect(
      `${BASE_URL}/login?verified=true`
    );

  } catch (error) {
    console.error("💥 ERRO NO VERIFY:", error);

    return NextResponse.redirect(
      `${BASE_URL}/login?error=server_error`
    );
  }
}