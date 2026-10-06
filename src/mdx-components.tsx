import { Children, isValidElement, type ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import s from "@/components/blog/Prose.module.css";

/** Paragraphe « **1. Lead** : texte » des articles → item numéroté (pastille + lead en gras). */
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

/** La section « Conclusion » devient l'encart plein aux couleurs de la rubrique. */
function H2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 {...props} className={children === "Conclusion" ? s.conclusion : undefined}>
      {children}
    </h2>
  );
}

const components: MDXComponents = { p: P, h2: H2 };

export function useMDXComponents(): MDXComponents {
  return components;
}
