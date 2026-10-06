import { Footer } from "@/components/layout/Footer";
import { Flottants } from "@/components/layout/Flottants";

/** Pages de vente (Accueil + 3 piliers) : barre de téléchargement mobile et QR flottant desktop. */
export default function VenteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer variant="vente" />
      <div aria-hidden="true" style={{ height: 80 }} />
      <Flottants />
    </>
  );
}
