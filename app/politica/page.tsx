import s from "@/app/styles/legal.module.css";

export default function PoliticaPrivacidade() {
  return (
    <div className={s.pageBg}>
      <main className={s.paper}>
        <h1>Política de Privacidade</h1>

        <p>
          A Lima e Lima valoriza sua privacidade e protege seus dados conforme a LGPD.
        </p>

        <h2>1. Dados coletados</h2>
        <p><strong>Informações fornecidas:</strong></p>
        <ul>
          <li>Nome, e-mail, telefone</li>
          <li>Endereço, CPF/CNPJ</li>
        </ul>

        <p><strong>Informações de navegação:</strong></p>
        <ul>
          <li>IP, localização, dispositivo</li>
          <li>Páginas acessadas</li>
        </ul>

        <p><strong>Pagamento:</strong> via plataformas seguras (não armazenamos cartão).</p>

        <h2>2. Uso dos dados</h2>
        <ul>
          <li>Processar pedidos</li>
          <li>Atendimento</li>
          <li>Comunicação</li>
          <li>Melhoria do site</li>
        </ul>

        <h2>3. Compartilhamento</h2>
        <p>
          Apenas com parceiros essenciais ou por obrigação legal. Não vendemos dados.
        </p>

        <h2>4. Cookies</h2>
        <p>
          Utilizados para navegação e análise. Podem ser desativados no navegador.
        </p>

        <h2>5. Segurança</h2>
        <p>
          Aplicamos medidas de proteção, mas nenhum sistema é 100% seguro.
        </p>

        <h2>6. Direitos (LGPD)</h2>
        <ul>
          <li>Acesso aos dados</li>
          <li>Correção</li>
          <li>Exclusão</li>
          <li>Revogação</li>
        </ul>

        <h2>7. Retenção</h2>
        <p>
          Mantidos pelo tempo necessário para obrigações legais e contratuais.
        </p>

        <h2>8. Alterações</h2>
        <p>
          Pode ser atualizada a qualquer momento.
        </p>

        <h2>9. Contato</h2>
        <p>
          Em caso de dúvidas, utilize nossos canais oficiais.
        </p>

        <p className={s.footerNote}>
          Última atualização: {new Date().toLocaleDateString()}
        </p>
      </main>
    </div>
  );
}