# DexTCGMaker - TCG Design & Simulation Lab

## Brand Identity

The official brand for DexTCGMaker is the **Tricolor Dog holding Trading Cards**.

### Usage Rules
- All brand rendering MUST be done through the `<DexLogoMark />` component.
- The logo must be present in the header, navigation, and all empty states.
- The logo is a pure vector SVG asset located in `brand/DexLogoMark.tsx`.

### Vectorization Workflow (Inkscape)
If you need to update the vector source:
1. Open original raster image in Inkscape.
2. Select the image.
3. Go to `Path > Trace Bitmap`.
4. Use `Multiple Scans (Colors)` for best fidelity.
5. Remove background and simplify paths.
6. Save as `Plain SVG`.
7. Ensure the result contains only `<path>`, `<g>`, and `<defs>` (NO `<image>` tags).

## Text Visibility Rules
- To ensure maximum readability, text truncation is forbidden for rules and mechanics.
- All containers use `white-space: normal; overflow-wrap: anywhere;`.
