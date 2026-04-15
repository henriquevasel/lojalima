"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styles from "@/app/styles/loja.module.css";

export default function StoreToolbar() {

const router = useRouter();
const params = useSearchParams();

const sort = params.get("sort") || "recent";

const [min, setMin] = useState(0);
const [max, setMax] = useState(60000);

function formatPrice(value: number) {
return value.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL"
});
}

function applyFilters() {


const searchParams = new URLSearchParams(params.toString());

searchParams.set("min", String(min));
searchParams.set("max", String(max));

router.push(`/loja?${searchParams.toString()}`);


}

function changeSort(value: string) {


const searchParams = new URLSearchParams(params.toString());

searchParams.set("sort", value);

router.push(`/loja?${searchParams.toString()}`);


}

function handleMinChange(value: number) {


if (value >= max) return;

setMin(value);


}

function handleMaxChange(value: number) {


if (value <= min) return;

setMax(value);


}

return (


<div className={styles.toolbar}>

  {/* ORDENAR */}

  <div className={styles.toolbarBlock}>

    <label>Ordenar por</label>

    <select
      value={sort}
      onChange={(e) => changeSort(e.target.value)}
    >
      <option value="recent">Mais recentes</option>
      <option value="bestsellers">Mais vendidos</option>
      <option value="price_asc">Menor preço</option>
      <option value="price_desc">Maior preço</option>
    </select>

  </div>


  <div className={styles.divider}></div>


  {/* PREÇO */}

  <div className={styles.toolbarBlock}>

    <label>Preço</label>

    <div className={styles.priceValues}>
      <span>Min: {formatPrice(min)}</span>
      <span>Max: {formatPrice(max)}</span>
    </div>

    <div className={styles.slider}>

      <input
        type="range"
        min="0"
        max="60000"
        value={min}
        onChange={(e) => handleMinChange(Number(e.target.value))}
      />

      <input
        type="range"
        min="0"
        max="60000"
        value={max}
        onChange={(e) => handleMaxChange(Number(e.target.value))}
      />

    </div>

  </div>


  <div className={styles.divider}></div>


  <button
    className={styles.applyButton}
    onClick={applyFilters}
  >
    Aplicar filtro
  </button>


</div>


);

}
