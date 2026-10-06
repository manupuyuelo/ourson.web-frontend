// Données statiques du handoff (ourson-site.js), textes tels quels (typographie française appliquée).
import type { StaticImageData } from "next/image";
import ageFamille from "@/assets/echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__0_famille.jpg";
import agePuree from "@/assets/echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__1_smooth_puree.jpg";
import ageMorceaux from "@/assets/echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__3_soft_pieces.jpg";
import miroir from "@/assets/echantillons/eveil/jeux/miroir_grimaces.jpg";
import bulles from "@/assets/echantillons/eveil/jeux/bulles_encore.jpg";
import scotch from "@/assets/echantillons/eveil/jeux/chemin_de_scotch.jpg";
import cacheCache from "@/assets/echantillons/eveil/jeux/cache_cache_foulard.jpg";
import pages from "@/assets/echantillons/eveil/jeux/tourner_les_pages.jpg";
import craies from "@/assets/echantillons/eveil/jeux/craies_dehors.jpg";
import foulard from "@/assets/echantillons/eveil/jeux/foulard_qui_danse.jpg";
import marchande from "@/assets/echantillons/eveil/jeux/la_marchande.jpg";
import etoiles from "@/assets/echantillons/sommeil/berceuses/berceuse_des_etoiles.jpg";
import herisson from "@/assets/echantillons/sommeil/histoires-du-soir/le_herisson_et_les_etoiles.jpg";
import moutons from "@/assets/echantillons/sommeil/berceuses/berceuse_des_moutons.jpg";
import bateau from "@/assets/echantillons/sommeil/histoires-du-soir/le_bateau_de_la_nuit.jpg";
import train from "@/assets/echantillons/sommeil/berceuses/berceuse_du_train.jpg";
import calin from "@/assets/echantillons/sommeil/histoires-du-soir/le_calin_du_soir.jpg";
import nuages from "@/assets/echantillons/sommeil/berceuses/berceuse_des_nuages.jpg";
import lune from "@/assets/echantillons/sommeil/histoires-du-soir/bonne_nuit_la_lune.jpg";
import ouEsTuDoudou from "@/assets/echantillons/eveil/histoires/ou_es_tu_doudou.jpg";

export type CarteTag = "À la maison" | "Dehors" | "Comptine" | "Histoire";
export type CarrouselItem = { src: StaticImageData; title: string; tag: CarteTag };

export const JEUX: CarrouselItem[] = [
  { src: miroir, title: "Miroir et grimaces", tag: "À la maison" },
  { src: bulles, title: "Les bulles\u00a0: encore\u202f!", tag: "Dehors" },
  { src: scotch, title: "Le chemin de scotch", tag: "À la maison" },
  { src: cacheCache, title: "Cache-cache foulard", tag: "À la maison" },
  { src: pages, title: "Tourner les pages", tag: "À la maison" },
  { src: craies, title: "Les craies sur le trottoir", tag: "Dehors" },
  { src: foulard, title: "Le foulard qui danse", tag: "À la maison" },
  { src: marchande, title: "La marchande", tag: "À la maison" },
];

export const SOIR: CarrouselItem[] = [
  { src: etoiles, title: "Une étoile, deux étoiles", tag: "Comptine" },
  { src: herisson, title: "Le hérisson compte les étoiles", tag: "Histoire" },
  { src: moutons, title: "Les moutons de la colline", tag: "Comptine" },
  { src: bateau, title: "Le petit bateau de la nuit", tag: "Histoire" },
  { src: train, title: "Le train du sommeil", tag: "Comptine" },
  { src: calin, title: "Le câlin du soir", tag: "Histoire" },
  { src: nuages, title: "Les nuages en coton", tag: "Comptine" },
  { src: lune, title: "Bonne nuit, la lune", tag: "Histoire" },
  { src: ouEsTuDoudou, title: "Où es-tu, doudou\u202f?", tag: "Histoire" },
];

export const AGES = [
  {
    src: ageFamille,
    chip: "Le plat des parents",
    line: "Prélevez 150 g de plat par enfant avant d’assaisonner.",
  },
  {
    src: agePuree,
    chip: "Dès 4 mois\u00a0: purée lisse",
    line: "Mixez sa part en purée bien lisse, sans morceau.",
  },
  {
    src: ageMorceaux,
    chip: "Dès 10 mois\u00a0: morceaux fondants",
    line: "Coupez sa part en morceaux fondants, écrasables entre deux doigts.",
  },
] as const;

export const HISTOIRE: readonly (readonly [texte: string, conseil: string])[] = [
  [
    "Ce soir, {prenom} et {doudou} écoutent la mer. Qui chante tout au fond\u202f?",
    "«\u00a0À ton avis, qui chante dans la mer\u202f?\u00a0»",
  ],
  [
    "Un poisson\u202f? Non\u202f! Il fait des bulles. Blub, blub. Qui chante tout au fond\u202f?",
    "Faites des bulles avec la bouche\u00a0: «\u00a0Blub, blub.\u00a0»",
  ],
  [
    "Un crabe\u202f? Non\u202f! Il fait clic-clac avec ses pinces. Qui chante tout au fond\u202f?",
    "Ouvrez et fermez les mains comme des pinces.",
  ],
  [
    "Une tortue\u202f? Non\u202f! Elle nage tout doucement. Qui chante tout au fond\u202f?",
    "Bougez les bras lentement, comme une tortue qui nage.",
  ],
  [
    "C’est la baleine\u202f! Elle chante «\u00a0Ouuuh\u00a0» pour dire bonne nuit.",
    "Chantez un long «\u00a0Ouuuh\u00a0» tout doux, ensemble.",
  ],
  [
    "{prenom} serre {doudou} très fort et ferme les yeux. Bonne nuit, la mer.",
    "Un câlin, puis on chuchote\u00a0: «\u00a0Bonne nuit.\u00a0»",
  ],
];

export const fill = (s: string, prenom?: string, doudou?: string) =>
  s.replaceAll("{prenom}", prenom || "Léa").replaceAll("{doudou}", doudou || "Pompon");
