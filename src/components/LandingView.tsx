import React from 'react';
import { HeroOverlay } from './HeroOverlay';
import { ThreeColumnLayout } from './layouts/ThreeColumnLayout';
import { Header } from './Header';
import { useSearch } from '../context/SearchContext';

export const LandingView = () => {
  const { searchState } = useSearch();
  const { hasSearched } = searchState;
  const [showHero, setShowHero] = React.useState(!hasSearched);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {showHero ? (
        <HeroOverlay onClose={() => setShowHero(false)} />
      ) : (
        <>
          <Header />
          <ThreeColumnLayout />
        </>
      )}
    </div>
  );
};