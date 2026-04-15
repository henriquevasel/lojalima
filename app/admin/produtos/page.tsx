"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProdutos(){

const router = useRouter();

const [products,setProducts] = useState<any[]>([]);


async function load(){

const res =
await fetch("/api/admin/products");

const data =
await res.json();

setProducts(data);

}


async function excluir(id:number){

if(!confirm("Excluir produto?")) return;

await fetch("/api/admin/products/"+id,{
method:"DELETE"
});

load();

}


useEffect(()=>{
load();
},[]);



return(

<div style={{
maxWidth:1100,
margin:"60px auto",
color:"#fff"
}}>


<h1>
Admin Produtos
</h1>


<button
onClick={()=>router.push("/admin/produtos/novo")}
style={{
marginTop:20,
padding:12,
background:"#00c853",
border:"none",
borderRadius:10,
cursor:"pointer"
}}
>

Novo Produto

</button>



{products.map(p=>(

<div
key={p.id}
style={{
background:"#111",
padding:20,
marginTop:20,
borderRadius:10,
display:"flex",
gap:20,
alignItems:"center"
}}
>


<img
src={p.images?.[0]?.url}
style={{width:80}}
/>


<div style={{flex:1}}>

<h3>
{p.name}
</h3>


<p>
R$ {(p.priceCents/100).toFixed(2)}
</p>

</div>


<div style={{display:"flex",gap:10}}>

<button
onClick={()=>router.push("/admin/produtos/"+p.id)}
style={{
padding:"8px 14px",
background:"#2962ff",
border:"none",
borderRadius:8,
cursor:"pointer"
}}
>

Editar

</button>


<button
onClick={()=>excluir(p.id)}
style={{
padding:"8px 14px",
background:"#d50000",
border:"none",
borderRadius:8,
cursor:"pointer"
}}
>

Excluir

</button>

</div>


</div>

))}



</div>

);

}