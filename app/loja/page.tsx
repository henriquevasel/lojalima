import { Suspense } from "react";
import HomeProducts from "@/app/components/HomeProducts";

export default function LojaPage() {
  return (
    <main className="lojaPage">
      <div className="lojaContainer">
      <Suspense fallback={<div>Carregando...</div>}>
        <HomeProducts />
      </Suspense>
       </div>
    </main>
  );
}