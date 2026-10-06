import type { ButtonHTMLAttributes } from "react";
import s from "./Button.module.css";

// Bouton du design system (components/actions/Button), variantes et tailles utilisées par le site.
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${s.button} ${s[variant]} ${s[size]}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
