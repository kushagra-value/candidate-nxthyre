import React  ,{ useState } from 'react';
import { CandidateCard } from './CandidateCard';
import { useSearch } from '../../context/SearchContext';
import { motion } from 'framer-motion';
import { NotepadText } from 'lucide-react';

export const CandidateList = () => {
  const { searchState } = useSearch();
  const { results, totalResults, isSearching, hasSearched } = searchState;
const [isNotesVisible, setIsNotesVisible] = useState(false);

  const toggleNotes = () => {
    setIsNotesVisible(!isNotesVisible);
  };
   if (isSearching) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="flex gap-4">
              <div className="rounded-full bg-gray-200 h-20 w-20"></div>
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex space-x-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Search Results Yet</h3>
        <p className="text-gray-500">
          Use the search options above to find candidates
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Candidates Found</h3>
        <p className="text-gray-500">
          Try adjusting your search criteria to see more results
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg w-full mx-auto my-6">
      

      {/* Button that toggles to Notes Input */}
      <div>
        {isNotesVisible ? (
          <div className="relative">
            <textarea
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
       </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">Showing {results.length} of {totalResults} candidates</div>
        <div className="text-sm text-gray-500">
          Sort By: <span className="font-medium">Relevance ▼</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {results.map((candidate, index) => (
          <CandidateCard key={candidate.id} candidate={candidate} index={index} />
        ))}
      </div>
    </div>
  );
};