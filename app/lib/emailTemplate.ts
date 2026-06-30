export function createEmailLayout({
  title,
  subtitle,
  buttonText,
  buttonLink,
  content,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  content?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${title}</title>

</head>

<body style="
margin:0;
padding:40px 0;
background:#f4f5f7;
font-family:Arial,Helvetica,sans-serif;
">

<table
width="100%"
cellpadding="0"
cellspacing="0"
>

<tr>

<td align="center">

<table
width="620"
cellpadding="0"
cellspacing="0"
style="
background:#ffffff;
border-radius:14px;
overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);
"
>

<!-- HEADER -->

<tr>

<td
align="center"
style="
background:#000;
padding:35px;
"
>

<img
src="https://lojalimaelima.com.br/produtos/logo.png"
alt="Loja Lima e Lima"
style="
max-height:70px;
"
/>

</td>

</tr>

<!-- CONTEÚDO -->

<tr>

<td
style="
padding:45px;
"
>

<h1
style="
margin:0;
font-size:30px;
color:#111;
"
>

${title}

</h1>

<p
style="
margin-top:18px;
font-size:17px;
color:#555;
line-height:1.7;
"
>

${subtitle}

</p>

${content ?? ""}

<div
style="
margin-top:35px;
text-align:center;
"
>

<a
href="${buttonLink}"
style="
display:inline-block;
padding:16px 34px;
background:#09c90e;
color:#fff;
text-decoration:none;
font-size:17px;
font-weight:bold;
border-radius:8px;
"

>

${buttonText}

</a>

</div>

<div
style="
margin-top:35px;
padding:18px;
background:#f5f5f5;
border-radius:10px;
font-size:14px;
color:#666;
line-height:1.7;
word-break:break-all;
"
>

<strong>O botão não funcionou?</strong>

<br><br>

Copie e cole este link no navegador:

<br><br>

${buttonLink}

</div>

<div
style="
margin-top:30px;
padding:18px;
border-left:4px solid #09c90e;
background:#eefdf0;
color:#333;
font-size:14px;
line-height:1.7;
"
>

🔒 Este link possui validade limitada por motivos de segurança.

</div>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td
style="
background:#fafafa;
padding:30px;
text-align:center;
font-size:13px;
color:#777;
line-height:1.8;
"
>

<strong
style="
color:#000;
font-size:15px;
"
>

Loja Lima e Lima

</strong>

<br>

Revenda Oficial Intelbras

<br>

Jaraguá do Sul • SC

<br><br>

<a
href="https://lojalimaelima.com.br"
style="
color:#09c90e;
text-decoration:none;
"
>

www.lojalimaelima.com.br

</a>

<br><br>

© ${new Date().getFullYear()} Loja Lima e Lima

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`;
}