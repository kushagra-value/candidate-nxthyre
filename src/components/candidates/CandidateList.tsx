import React from 'react';
import { CandidateCard } from './CandidateCard';
import { useSearch } from '../../context/SearchContext';
import { motion } from 'framer-motion';

export const CandidateList = () => {
  const { searchState } = useSearch();
  const { results, totalResults, isSearching, hasSearched } = searchState;

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-sm text-gray-500"
      >
        Showing {results.length} of {totalResults} candidates
      </motion.div>
      
      <div className="space-y-4">
        {results.map((candidate, index) => (
          <CandidateCard key={candidate.id} candidate={candidate} index={index} />
        ))}
      </div>
    </div>
  );
};