import React from "react";

export const DexLogoMark = ({ className = "" }: { className?: string }) => (
  <img
    src="/dex-logo.png"
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
