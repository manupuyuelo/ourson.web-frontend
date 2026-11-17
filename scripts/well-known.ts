// Fichiers des liens universels de l’app, écrits dans public/.well-known/ avant `next build`
// (voir src/lib/liens-universels.ts). Une valeur mal formée arrête le build : mieux vaut aucun
// fichier qu’un fichier qui ne marche pas.
import path from "node:path";
import { ecrireWellKnown } from "../src/lib/liens-universels.ts";

const dossier = path.join(import.meta.dirname, "..", "public", ".well-known");
for (const ligne of await ecrireWellKnown(dossier, process.env)) console.log(ligne);
