import React from 'react';
import { FilterSidebar } from '../filters/FilterSidebar';
import { CandidateList } from '../candidates/CandidateList';
import { SavedCandidatesSidebar } from '../sidebars/SavedCandidatesSidebar';

export const ThreeColumnLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-3">
          <FilterSidebar />
        </div>
        
        {/* Center - Candidate Results */}
        <div className="lg:col-span-6">
          <CandidateList />
        </div>
        
        {/* Right Sidebar - Saved Candidates */}
        <div className="lg:col-span-3">
          <SavedCandidatesSidebar />
        </div>
      </div>
    </div>
  );
};