import { Footer } from "@/components/layout/Footer";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <>
      <main id="contenu">{children}</main>
      <Footer />
    </>
  );
}
