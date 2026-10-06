import { Footer } from "@/components/layout/Footer";
import { Flottants } from "@/components/layout/Flottants";
import { PauseHorsEcran } from "@/components/layout/PauseHorsEcran";

/** Pages de vente (Accueil + 3 piliers) : barre de téléchargement mobile et QR flottant desktop. */
export default function VenteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
      <Flottants />
      <PauseHorsEcran />
    </>
  );
}
