"use client";

import {
  FaWhatsapp,
  FaCheckCircle,
} from "react-icons/fa";

import s from "@/app/styles/WhatsAppSection.module.css";

export default function WhatsAppSection() {

  const link =
    "https://wa.me/554738423235?text=Olá, gostaria de informações sobre sistemas de segurança.";

  return (
    <section className={s.wrapper}>

      <div className={s.content}>

        <div className={s.left}>

          <div className={s.iconBox}>
            <FaWhatsapp />
          </div>

          <div>

            <h2 className={s.title}>
              Precisa de ajuda para escolher?
            </h2>

            <p className={s.subtitle}>
              Nossa equipe ajuda você a encontrar a solução ideal para sua residência, empresa ou comércio.
            </p>

            <div className={s.benefits}>

              <span>
                <FaCheckCircle />
                Atendimento especializado
              </span>

              <span>
                <FaCheckCircle />
                Produtos originais Intelbras
              </span>

              <span>
                <FaCheckCircle />
                Suporte antes e após a compra
              </span>

              <span>
                <FaCheckCircle />
                Envio para todo Brasil
              </span>

            </div>

          </div>

        </div>

        <div className={s.actions}>

          <a
            href={link}
            target="_blank"
            className="btn btn-primary-light"
          >
            Falar no WhatsApp
          </a>

          <a
            href="/fale-conosco#form-orcamento"
            className="btn btn-outline-light"
          >
            Solicitar orçamento
          </a>

        </div>

      </div>

    </section>
  );
}