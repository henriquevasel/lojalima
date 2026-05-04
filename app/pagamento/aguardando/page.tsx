"use client";

import { Suspense } from "react";
import AguardandoPagamento from "./AguardandoPagamento";

export default function Page() {
  return (
    <Suspense fallback={
      <div style={{ padding: 40, textAlign: "center" }}>
        Carregando pagamento...
      </div>
    }>
      <AguardandoPagamento />
    </Suspense>
  );
}