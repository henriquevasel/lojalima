import Image from "next/image";
import s from "@/app/styles/InstallationServices.module.css";


export default function InstallationServices() {

  const services = [
    {
      name: "Instalação de Câmeras",
      description: "Instalação profissional de sistemas de segurança.",
      image: "/servicos/camera.jpg"
    },
    {
      name: "Configuração de Redes",
      description: "Configuração completa de rede e Wi-Fi.",
      image: "/servicos/rede.jpg"
    },
    {
      name: "Instalação de Roteadores",
      description: "Instalação e otimização de sinal.",
      image: "/servicos/roteador.jpg"
    }
  ];

  return (
    <section className={s.wrapper}>

      <h2 className={s.title}>
        Serviços de instalação
      </h2>

      <div className={s.grid}>

        {services.map((service) => (

          <div key={service.name} className={s.card}>

            <div className={s.imageWrap}>
              <Image
                src={service.image}
                alt={service.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className={s.content}>
              <h3 className={s.name}>{service.name}</h3>
              <p className={s.description}>{service.description}</p>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}