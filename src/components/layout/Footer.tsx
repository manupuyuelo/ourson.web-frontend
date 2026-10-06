import Link from "next/link";
import { SITE } from "@/lib/site";
import { GererCookies } from "@/components/consent/GererCookies";
import s from "./Footer.module.css";

type Props = {
  /** « vente » : masqué sur mobile (la barre de téléchargement occupe le bas de l'écran). */
  variant?: "vente" | "lecture";
  actif?: "confidentialite";
};

export function Footer({ variant = "lecture", actif }: Props) {
  return (
    <footer className={variant === "vente" ? `${s.footer} ${s.vente}` : s.footer}>
      <a href={`mailto:${SITE.email}`}>Contact</a>
      <Link href="/confidentialite" aria-current={actif === "confidentialite" ? "page" : undefined}>
        Confidentialité
      </Link>
      <a href={SITE.cgvUrl}>CGV</a>
      <GererCookies />
    </footer>
  );
}
