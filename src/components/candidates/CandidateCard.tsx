import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, IndianRupee, Clock, Bookmark, BadgeCheck, Diamond, Gem } from "lucide-react";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="  hover:shadow-lg transition-shadow relative"
      >
      <div className=" bg-white shadow-md rounded-lg p-4 w-full mx-auto">
        {/* Header Section */}

        {/* Job Info Section */}
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
          <div>
            <h2 className="text-xl font-bold text-gray-800">
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
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              {"  "}
              {candidate.currentTitle}  • 
              <span>{candidate.currentCompany}</span>
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="ml-20 grid grid-cols-3 mb-2">
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="text-sm font-medium text-gray-800">
              <span>{candidate.experience} years</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Notice Period</p>
            <p className="text-sm font-medium text-gray-800">
              <span>{candidate.noticePeriod} days</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current CTC</p>
            <p className="text-sm font-medium text-gray-800">
              {" "}
              <span>₹{candidate.currentSalary} LPA</span>
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-center">
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
          <div className="">
            <Button
              variant={isSaved ? "primary" : "outline"}
              leftIcon={
                <Bookmark
                  size={16}
                  className={isSaved ? "text-white" : "text-indigo-500"}
                />
              }
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation when clicking Save button
                e.stopPropagation(); // Stop event from bubbling to Link
                handleSave();
              }}
              disabled={isSaved}
              className="text-gray-800 mt-3"
            >
              {isSaved ? "Saved" : "Save Candidate"}
            </Button>
          </div>
        </div>
      </div>
      </motion.div>
    </Link>
  );
};
