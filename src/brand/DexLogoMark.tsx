import React from "react";
import dexLogoUrl from "@/assets/dex-logo.png";

type DexLogoMarkProps = {
  className?: string;
};

export const DexLogoMark: React.FC<DexLogoMarkProps> = ({ className = "" }) => {
  return (
    <img
      src={dexLogoUrl}
      alt="DexTCGMaker logo"
      aria-label="DexTCGMaker logo"
      className={className}
      style={{
        display: "block",
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
      }}
      draggable={false}
    />
  );
};
