import React from 'react';
import { FilterSidebar } from '../filters/FilterSidebar';
import { CandidateList } from '../candidates/CandidateList';
import { SavedCandidatesSidebar } from '../sidebars/SavedCandidatesSidebar';
import { useSearch } from '../../context/SearchContext';
import { ChevronDown } from 'lucide-react';

export const ThreeColumnLayout = () => {
  const { searchState } = useSearch();
  const { results, totalResults } = searchState;
  
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      {results.length > 0 && (
        <div className="mb-4 text-sm text-gray-500">
          
          <div className="flex justify-end">
            <div className="text-sm text-gray-600 flex items-center space-x-2 gap-2">
              Sort By: <button className="btn bg-gray-300/90 p-2 px-3 rounded-[10px] flex "><span> Date Posted 
               </span> 
               <ChevronDown 
                  size={16} 
                />
        </button>
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