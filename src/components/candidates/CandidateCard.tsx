import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee, Clock, Bookmark, BadgeCheck, Diamond, Gem, BookmarkCheck, BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Tag } from "../ui/Tag";
import { Candidate } from "../../types";
import { useSearch } from "../../context/SearchContext";

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

export const CandidateCard = ({ candidate, index }: CandidateCardProps) => {
  const { saveCandidate, searchState } = useSearch();
  const isSaved = searchState.savedCandidates.some(
    (c) => c.id === candidate.id
  );

  const handleSave = () => {
    saveCandidate(candidate);
  };

  const displayedSkills = candidate.skills.slice(0, 3);
  const remainingSkills = candidate.skills.length - 3;

  return (
    <Link to={`/candidate/${candidate.id}`} className="block">

      <div className="border border-gray-200 rounded-md shadow-lg mb-4 hover:bg-gray-50 transition-colors relative">
      

      <div className="flex p-4">
        <div className="mr-4">
<div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
            {candidate.profilePicture && candidate.profilePicture !== "N/A" ? (
              <img
              src={candidate.profilePicture}
              alt={candidate.name}
              className="w-16 h-16 object-cover rounded-lg border-2 border-indigo-100"
              />
            ) : (
              <div className="w-16 h-16 bg-indigo-100 rounded-lg border-2 border-indigo-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-500">
                {candidate.name.charAt(0)}
              </span>
              </div>
            )}
            </div>
          </div>

        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <Link to={`/candidate/${candidate.id}`} className="block">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
              {candidate.name}
              {candidate.isVerified && (
                <span className=" ml-2 inline-flex items-center  rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <BadgeCheck className="w-4 h-4"
                   />
                </span>
              )}
              {candidate.isTopTier && (
                <span className="ml-2 inline-flex items-center rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Gem className="w-4 h-4" />
                </span>
              )}
              </h3>

              <div className="text-sm text-gray-600 mt-1">
                {candidate.currentTitle || "N/A"} • {candidate.currentCompany || "N/A"}
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-3 mt-4 gap-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Experience</p>
              <p>{candidate.experience ? `${candidate.experience} years` : "N/A"}
            </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Notice Period</p>
              <p className="text-sm font-medium">{candidate.noticePeriod ? `${candidate.noticePeriod}` : "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Current CTC</p>
              <p className="text-sm font-medium">{candidate.currentSalary ? `${candidate.currentSalary}` : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 flex justify-between items-center bg-gray-100">
        <div className="text-xs text-gray-500">
          <div className="mt-3 flex flex-wrap gap-2">
            {displayedSkills.map((skill) => (
              <Tag key={skill} label={skill} size="sm" />
            ))}
            {remainingSkills > 0 && (
              <span className="text-xs text-gray-500 flex items-center">
                +{remainingSkills} more skills
              </span>
            )}
          </div> 
        </div>

        <button
          onClick={(e) => {
                e.preventDefault(); // Prevent navigation when clicking Save button
                e.stopPropagation(); // Stop event from bubbling to Link
                handleSave();
              }}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600" />
          ) : (
            <BookmarkPlus className="w-5 h-5" />
          )}
          <span className="ml-2">Save Candidate</span>
        </button>
      </div>
    </div>
    </Link>
  );
};
