"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");

    if (!token) return;

    async function verify() {
      const res = await fetch(`/api/auth/verify-email?token=${token}`);

      if (res.ok) {
        router.push("/login?verified=true");
      } else {
        router.push("/login?error=invalid_token");
      }
    }

    verify();
  }, [params, router]);

  return <p>Verificando email...</p>;
}