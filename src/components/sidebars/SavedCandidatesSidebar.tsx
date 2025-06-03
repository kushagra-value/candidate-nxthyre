import React from 'react';
import { MapPin } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '../../types';

interface CompactCandidateCardProps {
  candidate: Candidate;
  index: number;
}

const CompactCandidateCard = ({ candidate, index }: CompactCandidateCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
    >
      <img
        src={candidate.profilePicture}
        alt={candidate.name}
        className="w-10 h-10 rounded-full object-cover border border-indigo-100"
      />
      <div className="flex-grow overflow-hidden">
        <h4 className="font-medium text-gray-800 truncate">{candidate.name}</h4>
        <div className="flex items-center text-xs text-gray-500">
          <MapPin size={12} className="mr-1" />
          <span className="truncate">{candidate.location}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const SavedCandidatesSidebar = () => {
  const { searchState } = useSearch();
  const { savedCandidates, favorableCandidates } = searchState;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-7rem)] overflow-y-auto sticky top-28"
    >
      {/* Saved Candidates */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Saved Candidates ({savedCandidates.length})
        </h2>
        
        <AnimatePresence>
          {savedCandidates.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 italic"
            >
              No saved candidates yet
            </motion.p>
          ) : (
            <div className="space-y-2">
              {savedCandidates.slice(0, 4).map((candidate, index) => (
                <CompactCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  index={index}
                />
              ))}
              
              {savedCandidates.length > 4 && (
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Show {savedCandidates.length - 4} more
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Favorable Candidates */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Most Favorable Candidates in India
        </h2>
        
        <AnimatePresence>
          {favorableCandidates.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 italic"
            >
              No favorable candidates found
            </motion.p>
          ) : (
            <div className="space-y-2">
              {favorableCandidates.slice(0, 8).map((candidate, index) => (
                <CompactCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  index={index}
                />
              ))}
              
              {favorableCandidates.length > 8 && (
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Show more
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};