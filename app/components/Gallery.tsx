import Image from "next/image";
import styles from "app/styles/Gallery.module.css";

type Item = { src: string; alt: string; label?: string };

export default function Gallery({ items }: { items: Item[] }) {
  return (
    <div className={styles.grid}>
      {items.map((it, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.img}>
            <Image src={it.src} alt={it.alt} fill sizes="(max-width: 900px) 92vw, 360px" style={{ objectFit: "cover" }} />
          </div>
          {it.label ? <div className={styles.label}>{it.label}</div> : null}
        </div>
      ))}
    </div>
  );
}
