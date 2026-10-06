// Données statiques du handoff (ourson-site.js), textes du brief tels quels.
import type { StaticImageData } from "next/image";
import ageFamille from "@/assets/echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__0_famille.jpg";
import agePuree from "@/assets/echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__1_smooth_puree.jpg";
import ageMorceaux from "@/assets/echantillons/repas/un-plat-toute-la-tablee/beetroot_chicken_cumin_pan__3_soft_pieces.jpg";
import miroir from "@/assets/echantillons/eveil/jeux/miroir_grimaces.jpg";
import bulles from "@/assets/echantillons/eveil/jeux/bulles_encore.jpg";
import scotch from "@/assets/echantillons/eveil/jeux/chemin_de_scotch.jpg";
import panier from "@/assets/echantillons/eveil/jeux/panier_de_la_balade.jpg";
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

export type CarteTag = "À la maison" | "Dehors" | "Comptine" | "Histoire";
export type CarrouselItem = { src: StaticImageData; title: string; tag: CarteTag };

export const JEUX: CarrouselItem[] = [
  { src: miroir, title: "Miroir et grimaces", tag: "À la maison" },
  { src: bulles, title: "Les bulles : encore !", tag: "Dehors" },
  { src: scotch, title: "Le chemin de scotch", tag: "À la maison" },
  { src: panier, title: "Le panier de la balade", tag: "Dehors" },
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
];

export const AGES = [
  {
    src: ageFamille,
    chip: "Le plat des parents",
    line: "Prélevez 150 g de plat par enfant avant d’assaisonner.",
  },
  {
    src: agePuree,
    chip: "Dès 4 mois : purée lisse",
    line: "Mixez sa part en purée bien lisse, sans morceau.",
  },
  {
    src: ageMorceaux,
    chip: "Dès 10 mois : morceaux fondants",
    line: "Coupez sa part en morceaux fondants, écrasables entre deux doigts.",
  },
] as const;

export const HISTOIRE: readonly (readonly [texte: string, conseil: string])[] = [
  ["Ce matin, {prenom} cherche {doudou}. Où es-tu, {doudou} ?", "« À ton avis, où est-ce qu’on cherche ? »"],
  [
    "Sous le coussin ? Non ! Il y a une chaussette. Où es-tu, {doudou} ?",
    "Montrez un vrai coussin de la pièce, et soulevez-le ensemble.",
  ],
  [
    "Dans le panier ? Non ! Il y a une balle. Où es-tu, {doudou} ?",
    "Faites semblant de fouiller dans un panier avec les deux mains.",
  ],
  [
    "Derrière le rideau ? Non ! Il y a le chat qui dort. Chut ! Où es-tu, {doudou} ?",
    "Chuchotez : « Chut, il dort. »",
  ],
  ["Sous la couverture ? OUI ! Te voilà, {doudou} !", "Levez les bras : « Te voilà ! »"],
  [
    "{prenom} serre {doudou} très fort. Un grand câlin.",
    "Un câlin à trois, avec le vrai doudou s’il est là.",
  ],
];

export const fill = (s: string, prenom?: string, doudou?: string) =>
  s.replaceAll("{prenom}", prenom || "Léa").replaceAll("{doudou}", doudou || "Pompon");
