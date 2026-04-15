"use client";

import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <VerifyContent />
    </Suspense>
  );
}