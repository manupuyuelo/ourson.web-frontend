"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Telecharger } from "@/components/site/Telecharger";
import { SITE } from "@/lib/site";
import s from "./Header.module.css";

const NAV: { href: Route; label: string; c: string }[] = [
  { href: "/nutrition", label: "Nutrition", c: "var(--repas)" },
  { href: "/sommeil", label: "Sommeil", c: "var(--sommeil)" },
  { href: "/eveil", label: "Éveil", c: "var(--eveil)" },
  { href: "/blog", label: "Blog", c: "var(--ink)" },
];

const MENU: typeof NAV = [{ href: "/", label: "Accueil", c: "var(--coral)" }, ...NAV];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

const color = (c: string) => ({ "--c": c });

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={s.header}>
      {pathname === "/" ? (
        <span className={s.logo}>ourson</span>
      ) : (
        <Link href="/" className={s.logo} aria-label="Ourson, accueil">
          ourson
        </Link>
      )}
      <nav className={s.nav} aria-label="Navigation principale">
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={color(l.c)}
            aria-current={isActive(pathname, l.href) ? "page" : undefined}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <button
        type="button"
        className={s.burger}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen(true)}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <dialog
        id="menu-mobile"
        ref={menuRef}
        className={s.menu}
        aria-label="Menu"
        onClose={() => setOpen(false)}
      >
        <div className={s.menuTop}>
          {pathname === "/" ? (
            <span className={s.logo}>ourson</span>
          ) : (
            <Link href="/" className={s.logo} aria-label="Ourson, accueil" onClick={() => setOpen(false)}>
              ourson
            </Link>
          )}
          <button type="button" className={s.close} aria-label="Fermer" onClick={() => setOpen(false)}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className={s.menuNav} aria-label="Menu principal">
          {MENU.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={color(l.c)}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={s.menuBottom}>
          <div className={s.menuLinks}>
            <a href={`mailto:${SITE.email}`}>Contact</a>
            <Link
              href="/confidentialite"
              aria-current={pathname === "/confidentialite" ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              Confidentialité
            </Link>
            <a href={SITE.cgvUrl}>CGV</a>
            {/* Le bandeau s’ouvre via l’écouteur délégué ; on ferme le menu pour le laisser voir. */}
            <a href="#cookies" onClick={() => setOpen(false)}>
              Cookies
            </a>
          </div>
          <div className={s.rule} />
          {open && <Telecharger />}
        </div>
      </dialog>
    </header>
  );
}
