import assert from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';
import { DexLogoMark } from '@/brand/DexLogoMark';

const countLogos = (markup: string) =>
  (markup.match(/aria-label="DexTCGMaker logo"/g) ?? []).length;

// App shell should always render at least three logo instances (header + nav + footer badge)
const layoutMarkup = renderToStaticMarkup(
  <Layout activeView="Overview" setView={() => {}} children={<div>Test Content</div>} />
);
assert.ok(
  countLogos(layoutMarkup) >= 3,
  `Expected at least 3 DexTCGMaker logo instances in Layout, found ${countLogos(layoutMarkup)}`
);

// Empty state must carry brand identity for blank slates
const emptyMarkup = renderToStaticMarkup(<EmptyState message="Nothing here" />);
assert.ok(
  countLogos(emptyMarkup) >= 1,
  'EmptyState is missing the DexTCGMaker logo (aria-label search)'
);

// Logo component must point at the bundled PNG and expose aria metadata
const logoMarkup = renderToStaticMarkup(<DexLogoMark className="w-10 h-10" />);
assert.ok(
  logoMarkup.includes('aria-label="DexTCGMaker logo"'),
  'DexLogoMark is missing the required aria-label'
);
assert.ok(
  /src="[^"]*dex-logo\.png"/.test(logoMarkup),
  'DexLogoMark src does not point at dex-logo.png'
);
assert.ok(
  /alt="DexTCGMaker logo"/.test(logoMarkup),
  'DexLogoMark alt text is missing or incorrect'
);
