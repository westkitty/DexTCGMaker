import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from '@jest/globals';
import Layout from '../components/Layout';
import EmptyState from '../components/EmptyState';

describe('DexTCGMaker Brand Identity Proof', () => {
  test('App must render at least 3 instances of the brand logo in the main layout shell', () => {
    render(<Layout activeView="Overview" setView={() => {}} children={<div>Test Content</div>} />);
    
    // We query by aria-label to prove the brand component is used
    const logos = screen.getAllByLabelText("DexTCGMaker logo");
    
    // PROOF: Header (1), Nav Brand (1), Active Nav Icon (1) = 3 total
    expect(logos.length).toBeGreaterThanOrEqual(3);
  });

  test('EmptyState component must render the brand logo for consistent user experience', () => {
    render(<EmptyState message="Nothing here" />);
    const logo = screen.getByLabelText("DexTCGMaker logo");
    expect(logo).toBeInTheDocument();
    
    // Assert visual styles
    expect(logo).toHaveStyle({ objectFit: 'contain' });
  });
});
