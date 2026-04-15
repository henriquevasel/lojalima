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
      window.location.href = `/api/verify-email?token=${token}`;
    }

    verify();
  }, [params, router]);

  return <p>Verificando email...</p>;
}