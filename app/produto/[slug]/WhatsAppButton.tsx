"use client";

type Props = {
  phone: string; // ex: "5547999999999"
  message?: string;
};

export default function WhatsAppButton({ phone, message }: Props) {
  const text = encodeURIComponent(
    message ??
      "Olá! Tenho interesse neste produto e gostaria de falar com um atendente."
  );

  const href = `https://wa.me/${phone}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "14px 16px",
        borderRadius: 14,
        background: "#00a651",
        color: "#0b0b0b",
        fontWeight: 900,
        textDecoration: "none",
        width: "100%",
      }}
    >
      Falar com um atendente no WhatsApp
    </a>
  );
}
