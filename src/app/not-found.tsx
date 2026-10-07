import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OURS } from "@/lib/ours";
import s from "./not-found.module.css";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="contenu" className={s.nf}>
      <Image
        src={OURS.accueil}
        alt=""
        className={s.ours}
        sizes="180px"
        loading="eager"
        fetchPriority="high"
      />
      <h1 className={s.titre}>Cette page s’est cachée.</h1>
      <Link href="/" className={s.lien}>
        Retour à l’accueil →
      </Link>
    </main>
  );
}
