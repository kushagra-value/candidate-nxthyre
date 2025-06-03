  import React from 'react';
  import { MapPin, Briefcase, IndianRupee, Clock, Bookmark } from 'lucide-react';
  import { motion } from 'framer-motion';
  import { Button } from '../ui/Button';
  import { Tag } from '../ui/Tag';
  import { Candidate } from '../../types';
  import { useSearch } from '../../context/SearchContext';

  interface CandidateCardProps {
    candidate: Candidate;
    index: number;
  }

  export const CandidateCard = ({ candidate, index }: CandidateCardProps) => {
    const { saveCandidate, searchState } = useSearch();
    const isSaved = searchState.savedCandidates.some(c => c.id === candidate.id);
    
    const handleSave = () => {
      saveCandidate(candidate);
    };

    const displayedSkills = candidate.skills.slice(0, 3);
    const remainingSkills = candidate.skills.length - 3;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={candidate.profilePicture}
              alt={candidate.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
            />
          </div>
          
          {/* Details */}
          <div className="flex-grow">
            <div className="flex flex-wrap justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">
                {candidate.name}
                {candidate.isVerified && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
                {candidate.isTopTier && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Top Tier
                  </span>
                )}
              </h3>
            </div>
            
            <div className="mt-2 text-gray-600 flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{candidate.location}</span>
            </div>
            
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center text-gray-700">
                <Briefcase size={16} className="mr-1 text-gray-500" />
                <span>{candidate.experience} years experience</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <IndianRupee size={16} className="mr-1 text-gray-500" />
                <span>₹{candidate.currentSalary} LPA</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock size={16} className="mr-1 text-gray-500" />
                <span>{candidate.noticePeriod} days notice</span>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {displayedSkills.map(skill => (
                <Tag key={skill} label={skill} size="sm" />
              ))}
              {remainingSkills > 0 && (
                <span className="text-xs text-gray-500 flex items-center">
                  +{remainingSkills} more skills
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Save Button - Bottom Right */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant={isSaved ? 'primary' : 'outline'}
            leftIcon={<Bookmark size={16} className={isSaved ? 'text-white' : 'text-indigo-500'} />}
            onClick={handleSave}
            disabled={isSaved}
            className="text-gray-800"
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </motion.div>
    );
  };