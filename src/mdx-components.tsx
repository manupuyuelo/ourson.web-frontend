import { Children, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import s from "@/components/blog/Prose.module.css";

/** Item « **1. Titre.** texte » (préparé par lib/remark-points.ts) → pastille numérotée + titre en gras. */
function P({ children, ...props }: ComponentPropsWithoutRef<"p">) {
  const [premier, ...suite] = Children.toArray(children);
  const lead =
    isValidElement<{ children?: unknown }>(premier) && premier.type === "strong"
      ? premier.props.children
      : null;
  const m = typeof lead === "string" ? /^(\d+)\.\s*(.*)$/s.exec(lead) : null;
  if (!m) return <p {...props}>{children}</p>;
  return (
    <div className={s.point}>
      <span className={s.num} aria-hidden="true">
        {m[1]}
      </span>
      <p {...props}>
        <span className="srOnly">{m[1]}. </span>
        <strong>{m[2]}</strong>
        {suite}
      </p>
    </div>
  );
}

/** Série d’items numérotés : encadrée (pastilles claires) quand l’intro parle de conseils. */
function Points({ encadre, children }: { encadre?: boolean; children?: ReactNode }) {
  return <div className={encadre ? `${s.points} ${s.encadre}` : s.points}>{children}</div>;
}

/** La section « Conclusion » devient l’encart plein aux couleurs de la rubrique. */
function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 {...props} className={children === "Conclusion" ? s.conclusion : undefined}>
      {children}
    </h2>
  );
}

const components: MDXComponents = { p: P, h2: H2, Points };

export function useMDXComponents(): MDXComponents {
  return components;
}
