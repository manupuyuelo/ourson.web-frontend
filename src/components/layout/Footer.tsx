import Link from "next/link";
import { SITE } from "@/lib/site";
import s from "./Footer.module.css";

type Props = { actif?: "confidentialite" | "cgu" };

/** Barre de liens, desktop uniquement : sur téléphone et tablette, ces liens sont dans le menu. */
export function Footer({ actif }: Props) {
  return (
    <footer className={s.footer}>
      <a href={`mailto:${SITE.email}`}>Contact</a>
      <Link href="/confidentialite" aria-current={actif === "confidentialite" ? "page" : undefined}>
        Confidentialité
      </Link>
      <Link href="/cgu" aria-current={actif === "cgu" ? "page" : undefined}>
        CGU
      </Link>
      {/* Rouvre le bandeau de consentement (écouteur délégué dans ConsentBanner). */}
      <a href="#cookies">Cookies</a>
    </footer>
  );
}
