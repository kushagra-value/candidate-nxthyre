import React , {useState } from 'react';
import { FilterSidebar } from '../filters/FilterSidebar';
import { CandidateList } from '../candidates/CandidateList';
import { SavedCandidatesSidebar } from '../sidebars/SavedCandidatesSidebar';
import { useSearch } from '../../context/SearchContext';
import { ChevronDown } from 'lucide-react';

export const ThreeColumnLayout = () => {
  const { searchParams, updateSearchParams, executeSearch, resetSearch } = useSearch();
  const { searchState } = useSearch();
  const { results, totalResults } = searchState;
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  
    const toggleNotes = () => {
      setIsNotesVisible(!isNotesVisible);
    };

    const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSearchParams({ keywords: e.target.value });
    
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 mt-8">
      {results.length > 0 && (
        <></>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-3">
          <FilterSidebar />
        </div>
        
        {/* Center - Candidate Results */}
        <div className="lg:col-span-6">
          <div>
        {isNotesVisible ? (
          <div className="relative">
            <textarea
              value={searchParams.keywords || ""}
              onChange={handleKeywordsChange}
              placeholder="Enter additional keywords or notes..."
              className="w-full p-3 rounded-lg focus:outline-none text-gray-700 placeholder-gray-400 resize-none h-16"
            />
          </div>
        ) : (
          <button
            onClick={toggleNotes}
            className="w-full mb-4 bg-blue-200 bg-opacity-20 rounded-lg px-4 py-2 flex items-start max-w-full border border-indigo-400 cursor-pointer"
          >
            <div className="text-blue-800 p-1.5 rounded mr-2 mt-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>
            <div>
              <p className="flex flex-col items-start text-lg font-medium">Enter additional keywords or notes</p>
              <p className="text-sm text-gray-400">
                We'll find the best candidates, Right People Right away!
              </p>
            </div>
           {/* <NotepadText />
           <div className='flex flex-col items-start ml-5'>
            <span className="text-sm font-semibold text-gray-800">
               Enter additional keywords or notes
            </span>
            <p className="text-xs text-gray-500">
              We'll find the best candidates, Right People Right away!
            </p>
            </div> */}
          </button>
        )}
      </div>
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