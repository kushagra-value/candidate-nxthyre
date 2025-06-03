import React from 'react';
import { SearchProvider } from './context/SearchContext';
import { LandingView } from './components/LandingView';

function App() {
  return (
    <SearchProvider>
      <LandingView />
    </SearchProvider>
  );
}

export default App;