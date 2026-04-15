import { Suspense } from "react";
import RetornoPagamento from "./RetornoPagamento";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando pagamento...</div>}>
      <RetornoPagamento />
    </Suspense>
  );
}