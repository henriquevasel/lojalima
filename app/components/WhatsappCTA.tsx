import s from "@/app/styles/WhatsappCTA.module.css";

export default function WhatsappCTA() {

  return (
    <section className={s.wrapper}>

      <h2 className={s.title}>
        Precisa de ajuda para escolher?
      </h2>

      <p className={s.subtitle}>
        Fale com nossa equipe agora mesmo
      </p>

      <a
        href="https://wa.me/554738423235"
        target="_blank"
        className="btn btn-primary-light"
      >
        Chamar no WhatsApp
      </a>

    </section>
  );
}