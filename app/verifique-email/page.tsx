"use client";

import { Suspense } from "react";
import VerifiqueEmailContent from "./VerifiqueEmailContent";

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <VerifiqueEmailContent />
    </Suspense>
  );
}