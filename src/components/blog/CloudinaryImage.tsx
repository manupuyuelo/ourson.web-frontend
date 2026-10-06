"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";
import { cloudinaryLoader } from "@/lib/cloudinary-loader";

type Props = {
  src: string;
  /** Ourson de la rubrique, affiché en « contain » si l'image Cloudinary ne charge pas. */
  repli: StaticImageData;
  alt: string;
  sizes: string;
  width: number;
  height: number;
  className?: string;
  /** Image au-dessus de la ligne de flottaison (LCP). */
  eager?: boolean;
};

export function CloudinaryImage({ src, repli, alt, sizes, width, height, className, eager }: Props) {
  const [erreur, setErreur] = useState(false);
  const priorite = eager ? ({ loading: "eager", fetchPriority: "high" } as const) : {};

  if (erreur) {
    return (
      <Image
        src={repli}
        alt={alt}
        sizes={sizes}
        className={className}
        style={{ objectFit: "contain", padding: 12, boxSizing: "border-box" }}
      />
    );
  }
  return (
    <Image
      loader={cloudinaryLoader}
      src={src}
      alt={alt}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      {...priorite}
      onError={() => setErreur(true)}
      // L'erreur a pu survenir avant l'hydratation : onError ne se déclenchera plus.
      ref={(img) => {
        if (img?.complete && img.naturalWidth === 0) setErreur(true);
      }}
    />
  );
}
