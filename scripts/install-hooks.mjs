/**
 * Ourson web — arme les hooks `pre-commit` et `pre-push` du dépôt (`.githooks/`), appelé en `postinstall`.
 *
 * Prudent par construction : il ne touche à rien en CI, hors dépôt git, ou quand
 * `core.hooksPath` pointe déjà ailleurs — et il ne rend JAMAIS un code d'erreur, pour
 * qu'un `yarn install` ne puisse pas échouer à cause de lui.
 */
import { execFileSync } from "node:child_process";

const HOOKS_PATH = ".githooks";

const git = (args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

try {
  if (process.env.CI) process.exit(0);

  // Hors dépôt git (installation depuis un tarball, image de build) : rien à faire.
  if (git(["rev-parse", "--is-inside-work-tree"]) !== "true") process.exit(0);

  let current = "";
  try {
    current = git(["config", "--local", "core.hooksPath"]);
  } catch {
    // Non réglé : `git config` sort en 1, ce n'est pas une erreur ici.
  }

  // Une configuration existante ne s'écrase pas.
  if (current && current !== HOOKS_PATH) process.exit(0);
  if (current === HOOKS_PATH) process.exit(0);

  git(["config", "--local", "core.hooksPath", HOOKS_PATH]);
  console.log(`✓ hooks git actifs (core.hooksPath = ${HOOKS_PATH})`);
} catch {
  // Silence volontaire : un hook non posé ne justifie pas de casser l'installation.
}
