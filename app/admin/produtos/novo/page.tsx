"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoProduto(){

const router = useRouter();

const [name,setName] = useState("");
const [slug,setSlug] = useState("");
const [price,setPrice] = useState("");
const [description,setDescription] = useState("");
const [image,setImage] = useState("");


async function salvar(){

await fetch("/api/admin/products",{

method:"POST",

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
Novo Produto
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
background:"#00c853",
border:"none",
borderRadius:10
}}
>

Salvar Produto

</button>


</div>

);

}