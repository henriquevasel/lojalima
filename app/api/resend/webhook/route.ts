import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📨 WEBHOOK RESEND");
    console.log(JSON.stringify(body, null, 2));

    const type = body.type;
    const data = body.data;

    const resendEmailId = data?.email_id;

    if (!resendEmailId) {
      return NextResponse.json(
        { success: false, message: "Email ID não encontrado." },
        { status: 400 }
      );
    }

   console.log("📧 Evento:", type);
console.log("📧 Email ID recebido:", resendEmailId);

const user = await prisma.user.findFirst({
  where: {
    resendEmailId,
  },
});

console.log("👤 Usuário encontrado:", user?.email);

    if (!user) {
      console.log("⚠ Usuário não encontrado:", resendEmailId);

      return NextResponse.json({
        success: true,
      });
    }

    switch (type) {
      case "email.delivered":
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailStatus: "delivered",
            emailLastError: null,
          },
        });

        break;

      case "email.bounced":
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailStatus: "bounced",
            emailLastError:
              data?.bounce?.reason ||
              data?.bounce?.message ||
              "Bounce",
          },
        });

        break;

      case "email.complained":
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailStatus: "complained",
          },
        });

        break;

      default:
        console.log("Evento ignorado:", type);
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("❌ WEBHOOK:", error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}