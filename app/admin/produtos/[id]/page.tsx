"use client";

import { useEffect,useState } from "react";
import { useRouter,useParams } from "next/navigation";

export default function EditarProduto(){

const router = useRouter();

const params = useParams();

const id = params.id;


const [name,setName] = useState("");
const [slug,setSlug] = useState("");
const [price,setPrice] = useState("");
const [description,setDescription] = useState("");
const [image,setImage] = useState("");


async function load(){

const res =
await fetch("/api/admin/products/"+id);

const p =
await res.json();


setName(p.name);

setSlug(p.slug);

setPrice(String(p.priceCents/100));

setDescription(p.description);

setImage(p.images?.[0]?.url || "");

}


useEffect(()=>{
if(id) load();
},[id]);



async function salvar(){

await fetch("/api/admin/products/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name,

slug,

priceCents:Number(price)*100,

description,

imageUrl:image

})

});


router.push("/admin/produtos");

}



return(

<div style={{
maxWidth:600,
margin:"60px auto",
color:"#fff"
}}>


<h1>
Editar Produto
</h1>


<input
placeholder="Nome"
value={name}
onChange={e=>setName(e.target.value)}
/>

<br/><br/>


<input
placeholder="Slug"
value={slug}
onChange={e=>setSlug(e.target.value)}
/>

<br/><br/>


<input
placeholder="Preço"
value={price}
onChange={e=>setPrice(e.target.value)}
/>

<br/><br/>


<input
placeholder="Imagem URL"
value={image}
onChange={e=>setImage(e.target.value)}
/>

<br/><br/>


<textarea
placeholder="Descrição"
value={description}
onChange={e=>setDescription(e.target.value)}
/>


<br/><br/>


<button
onClick={salvar}
style={{
padding:14,
background:"#2962ff",
border:"none",
borderRadius:10,
cursor:"pointer"
}}
>

Salvar Alterações

</button>


</div>

);
}