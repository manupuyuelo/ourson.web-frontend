import Image from "next/image";
import Link from "next/link";
import { Telecharger } from "@/components/site/Telecharger";
import { OURS } from "@/lib/ours";
import { PILIERS, type Pilier } from "@/lib/site";
import s from "./FinDePage.module.css";

type Props = { page: "accueil" | Pilier };

/** Fin des pages de vente : ourson, « Besoin d'un coup de patte ? », téléchargement, autres piliers. */
export function FinDePage({ page }: Props) {
  const autres = (["repas", "sommeil", "eveil"] as const satisfies Pilier[]).filter((p) => p !== page);
  return (
    <section className={page === "accueil" ? `${s.fin} ${s.accueil}` : s.fin} aria-labelledby="fin-titre">
      <Image src={OURS[page]} alt="" className={s.ours} sizes={page === "accueil" ? "200px" : "180px"} />
      {page === "accueil" && <div className={s.logo}>ourson</div>}
      <h2 id="fin-titre" className={s.titre}>
        Besoin d&apos;un coup de patte ?
      </h2>
      <div id="telecharger" className={s.telecharger}>
        <Telecharger />
      </div>
      <div className={s.liens}>
        {autres.map((p) => (
          <Link key={p} href={PILIERS[p].href} style={{ "--c": `var(--${p})` }}>
            {PILIERS[p].lien}
          </Link>
        ))}
      </div>
    </section>
  );
}
