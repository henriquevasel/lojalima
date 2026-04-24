import s from "@/app/styles/legal.module.css";

export default function TermosDeUso() {
  return (
    <div className={s.pageBg}>
      <main className={s.paper}>
        <h1>Termos e Condições de Uso</h1>

        <p>
          Ao acessar e utilizar este site, você concorda com os presentes Termos e Condições.
          Caso não concorde com qualquer parte, recomendamos que não utilize nossos serviços.
        </p>

        <h2>1. Sobre a empresa</h2>
        <p>
          A Lima e Lima Instalações e Manutenção atua na venda, instalação, configuração e manutenção de sistemas de segurança eletrônica, redes, data center, controle de acesso, alarmes e CFTV.
        </p>

        <h2>2. Uso do site</h2>
        <p>
          O conteúdo deste site possui caráter informativo e comercial, podendo ser alterado a qualquer momento.
        </p>
        <ul>
          <li>Utilizar o site para fins ilegais</li>
          <li>Copiar ou reproduzir conteúdos sem autorização</li>
          <li>Tentar acessar áreas restritas</li>
        </ul>

        <h2>3. Cadastro do usuário</h2>
        <p>
          O usuário deve fornecer dados verdadeiros e é responsável pela sua conta.
        </p>

        <h2>4. Produtos e serviços</h2>
        <ul>
          <li>Sujeitos à disponibilidade</li>
          <li>Imagens ilustrativas</li>
          <li>Podem sofrer alterações</li>
        </ul>

        <h2>5. Preços e pagamentos</h2>
        <ul>
          <li>Podem mudar sem aviso</li>
          <li>Pagamento via cartão, PIX, boleto</li>
          <li>Pedido confirmado após pagamento</li>
        </ul>

        <h2>6. Entregas</h2>
        <ul>
          <li>Prazos estimados</li>
          <li>Atrasos de terceiros não são responsabilidade da empresa</li>
        </ul>

        <h2>7. Garantias</h2>
        <p>
          Seguem o fabricante e contrato. Não cobre mau uso.
        </p>

        <h2>8. Limitação de responsabilidade</h2>
        <p>
          Não nos responsabilizamos por uso inadequado ou falhas externas.
        </p>

        <h2>9. Propriedade intelectual</h2>
        <p>
          Conteúdo protegido por direitos autorais.
        </p>

        <h2>10. Privacidade</h2>
        <p>
          Tratamento de dados conforme LGPD.
        </p>

        <h2>11. Alterações</h2>
        <p>
          Termos podem ser atualizados.
        </p>

        <h2>12. Lei aplicável</h2>
        <p>
          Regido pelas leis brasileiras.
        </p>

        <h2>13. Contato</h2>
        <p>
          Entre em contato pelos canais oficiais.
        </p>

        <p className={s.footerNote}>
          Última atualização: {new Date().toLocaleDateString()}
        </p>
      </main>
    </div>
  );
}