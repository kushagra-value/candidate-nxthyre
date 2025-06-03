import React from 'react';
import { FilterSidebar } from '../filters/FilterSidebar';
import { CandidateList } from '../candidates/CandidateList';
import { SavedCandidatesSidebar } from '../sidebars/SavedCandidatesSidebar';
import { useSearch } from '../../context/SearchContext';

export const ThreeColumnLayout = () => {
  const { searchState } = useSearch();
  const { results, totalResults } = searchState;
  
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {results.length > 0 && (
        <div className="mb-4 text-sm text-gray-500">
          {results.length} results found
          <div className="flex justify-end">
            <div className="text-sm text-gray-600">
              Sort By: <span className="font-medium">Date Posted</span>
            </div>
          </div>
        </div>
      )}
      
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