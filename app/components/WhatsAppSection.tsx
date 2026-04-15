"use client";

import s from "@/app/styles/WhatsAppSection.module.css";

export default function WhatsAppSection() {

  const link =
    "https://wa.me/554738423235?text=Olá, gostaria de informações sobre sistemas de segurança.";

  return (
    <section className={s.wrapper}>

      <div className={s.content}>

        <div className={s.text}>
          <h2 className={s.title}>Precisa de agilidade?</h2>
          <p className={s.subtitle}>
            Chame no WhatsApp e informe sua cidade, o tipo de ambiente e o que você precisa.
          </p>
        </div>

        <div className={s.actions}>
          <a href={link} target="_blank" className="btn btn-primary-light">
            Falar no WhatsApp
          </a>

          <a href="/fale-conosco#form-orcamento" className="btn btn-outline-light">
            Faça seu orçamento
          </a>
        </div>

      </div>

    </section>
  );
}