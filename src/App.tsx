import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import { LandingView } from './components/LandingView';
import CandidateDetailPage from './components/candidates/Candidate-detail';


function App() {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/search" element={<LandingView />} />
          <Route path="/candidate/:id" element={<CandidateDetailPage />} />
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  );
}

export default App;