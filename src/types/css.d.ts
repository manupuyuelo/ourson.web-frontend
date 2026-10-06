import "react";

// Autorise les variables CSS (--r, --c, --d…) dans les props style sans cast.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
