import React from "react";

/**
 * DexTCGMaker Logo Mark Component
 * Fixed: Uses native browser URL resolution to avoid "Black Screen" crash caused by illegal PNG imports in ESM.
 */
export const DexLogoMark = ({ className = "" }: { className?: string }) => {
  // PHASE 4: EXACT LOGO PATH BUG FIX
  // We use new URL to calculate the path relative to the current module.
  // This is the standard "matching the bundler" logic for browser-native ESM environments.
  const logoUrl = new URL("../assets/dex-logo.png", import.meta.url).href;

  return (
    <img
      src={logoUrl}
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
      onError={(e) => {
        console.warn("DexTCGMaker logo failed to load. Fallback to root path.");
        // Secondary fallback to root for extreme compatibility cases
        if (!e.currentTarget.src.endsWith("dex-logo.png")) {
           e.currentTarget.src = "dex-logo.png";
        }
      }}
    />
  );
};
