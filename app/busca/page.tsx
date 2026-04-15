import { Suspense } from "react";
import BuscaClient from "@/app/components/BuscaClient";

export default function BuscaPage() {
  return (
    <Suspense fallback={<div>Carregando busca...</div>}>
      <BuscaClient />
    </Suspense>
  );
}