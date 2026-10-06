"use client";

import { useSyncExternalStore } from "react";
import { detectDevice, type Appareil } from "./device";

const subscribe = () => () => {};

/** null pendant le rendu serveur et l'hydratation, puis l'appareil détecté. */
export function useAppareil(): Appareil | null {
  return useSyncExternalStore(subscribe, detectDevice, () => null);
}
