import React from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, Briefcase, GraduationCap } from 'lucide-react';
import { RangeSlider } from '../ui/RangeSlider';
import { Input } from '../ui/Input';
import { TagInput } from '../ui/TagInput';
import { Button } from '../ui/Button';
import { useSearch } from '../../context/SearchContext';
import { industries, educationLevels, universityTiers, salaryRanges } from '../../data/mockData';

export const FilterSidebar = () => {
  const { searchParams, updateSearchParams } = useSearch();

  const handleIndustryChange = (industry: string) => {
    const updated = searchParams.industry.includes(industry)
      ? searchParams.industry.filter(i => i !== industry)
      : [...searchParams.industry, industry];
    updateSearchParams({ industry: updated });
  };

  const handleEducationChange = (education: string) => {
    const updated = searchParams.educationLevel.includes(education)
      ? searchParams.educationLevel.filter(e => e !== education)
      : [...searchParams.educationLevel, education];
    updateSearchParams({ educationLevel: updated });
  };

  const handleVerificationChange = (type: keyof typeof searchParams.verificationStatus, value: boolean) => {
    updateSearchParams({
      verificationStatus: {
        ...searchParams.verificationStatus,
        [type]: value
      }
    });
  };

  const handleUniversityTierChange = (tier: string) => {
    const updated = searchParams.universityTier.includes(tier)
      ? searchParams.universityTier.filter(t => t !== tier)
      : [...searchParams.universityTier, tier];
    updateSearchParams({ universityTier: updated });
  };

  const handleSalaryRangeChange = (range: string) => {
    const updated = searchParams.currentSalaryRange.includes(range)
      ? searchParams.currentSalaryRange.filter(r => r !== range)
      : [...searchParams.currentSalaryRange, range];
    updateSearchParams({ currentSalaryRange: updated });
  };

  const handleExpectedCTCChange = (range: string) => {
    const updated = searchParams.expectedCTCRange.includes(range)
      ? searchParams.expectedCTCRange.filter(r => r !== range)
      : [...searchParams.expectedCTCRange, range];
    updateSearchParams({ expectedCTCRange: updated });
  };
  const toggleVerifiedOnly = () => {
    updateSearchParams({ verifiedOnly: !searchParams.verifiedOnly });
  };

  const toggleTopTierOnly = () => {
    updateSearchParams({ topTierOnly: !searchParams.topTierOnly });
  };

  const clearSection = (section: string) => {
    switch (section) {
      case 'industry':
        updateSearchParams({ industry: [] });
        break;
      case 'educationLevel':
        updateSearchParams({ educationLevel: [] });
        break;
      case 'verificationStatus':
        updateSearchParams({
          verificationStatus: {
            email: false,
            linkedin: false,
            employment: false,
            education: false
          }
        });
        break;
      case 'universityTier':
        updateSearchParams({ universityTier: [] });
        break;
      case 'currentSalaryRange':
        updateSearchParams({ currentSalaryRange: [] });
        break;
      case 'expectedCTCRange':
        updateSearchParams({ expectedCTCRange: [] });
        break;
      default:
        break;
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg  p-4 h-[calc(100vh-7rem)] overflow-y-auto sticky top-28 scrollbar-hide"
    >
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}
      </style>
      
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 ">Filters</h2>
          {searchParams.industry.length > 0 && (
            <button
              className="text-blue-500 text-sm hover:underline"
              onClick={() => clearSection('industry')}
            >
              ClearAll
            </button>
          )}
        </div>
      <div className="space-y-6">
        {/* Industry */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Most Frequent</h3>
            {(searchParams.verifiedOnly||searchParams.topTierOnly) && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('topTierOnly')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2 flex flex-col items-start text-sm">
            
              <button
              key={'topTierOnly'}
                onClick={toggleTopTierOnly}
                className={`justify-start  focus:bg-blue-400 focus:text-white focus:px-2 text-sm rounded-[4px]'}`}
              >
                Top Tier
              </button>
              <button
              key={'topTierOnly'}
                onClick={toggleVerifiedOnly}
                className={`justify-start  focus:bg-blue-400 focus:text-white focus:px-2 text-sm rounded-[4px]'}`}
              >
                Verified Profile
              </button>
              
          </div>
          {/* Skills */}
        
          
        
        </div>
        {/* Industry */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Industry</h3>
            {searchParams.industry.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('industry')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2 flex flex-col items-start text-sm">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => handleIndustryChange(industry)}
                className={` justify-start ${searchParams.industry.includes(industry) ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* Notice period */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Notice Period</h3>
          <TagInput
            tags={searchParams.skills}
            onChange={(tags) => updateSearchParams({ skills: tags })}
            placeholder="10 days"
          />
        </div>
        
        {/* Education Level */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Education Level</h3>
            {searchParams.educationLevel.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('educationLevel')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2 flex flex-col items-start text-sm">
            {educationLevels.map((education) => (
              <button
                key={education}
                onClick={() => handleEducationChange(education)}
                className={` justify-start ${searchParams.educationLevel.includes(education) ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
              >
                {education}
              </button>
            ))}
          </div>
        </div>
        
        {/* Verification Status */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Verification Status</h3>
            {(searchParams.verificationStatus.email || searchParams.verificationStatus.linkedin || 
              searchParams.verificationStatus.employment || searchParams.verificationStatus.education) && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('verificationStatus')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2 flex flex-col items-start text-sm">
            <button
              
              onClick={() => handleVerificationChange('email', !searchParams.verificationStatus.email)}
              className={` justify-start ${searchParams.verificationStatus.email ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
            >
              Email Verified
            </button>
            <button
              
              onClick={() => handleVerificationChange('linkedin', !searchParams.verificationStatus.linkedin)}
              className={` justify-start ${searchParams.verificationStatus.linkedin ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
            >
              LinkedIn Verified
            </button>
            <button
             
              onClick={() => handleVerificationChange('employment', !searchParams.verificationStatus.employment)}
              className={` justify-start ${searchParams.verificationStatus.employment ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
            >
              Employment History Verified
            </button>
            <button
              
              onClick={() => handleVerificationChange('education', !searchParams.verificationStatus.education)}
              className={` justify-start ${searchParams.verificationStatus.education ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
            >
              Education Background Verified
            </button>
          </div>
        </div>
        
        {/* Employment Gaps */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Verification Status</h3>
            {(searchParams.employmentGaps==true||!searchParams.employmentGaps==true) && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('verificationStatus')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2 flex flex-col items-start text-sm">
            <button
            onClick={() => updateSearchParams({ employmentGaps: searchParams.employmentGaps })}
            className={` ${searchParams.employmentGaps ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
          >
            Yes
          </button>
            <button
            onClick={() => updateSearchParams({ employmentGaps: !searchParams.employmentGaps })}
            className={` ${searchParams.employmentGaps ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
          >
            No
          </button>
            
            
          </div>
        </div>
        
       
        
        {/* Skills */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Skills</h3>
          <TagInput
            tags={searchParams.skills}
            onChange={(tags) => updateSearchParams({ skills: tags })}
            placeholder="Add skills..."
          />
        </div>
        
        {/* Graduation Year */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">Graduation Year</h3>
          <RangeSlider
            min={2010}
            max={2024}
            value={searchParams.graduationYearRange}
            onChange={(value) => updateSearchParams({ graduationYearRange: value })}
          />
        </div>
        
        {/* University */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-2">University</h3>
          <Input
            placeholder="Search university..."
            value={searchParams.university}
            onChange={(e) => updateSearchParams({ university: e.target.value })}
          />
        </div>
        
        {/* University Tier */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">University Tier</h3>
            {searchParams.universityTier.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('universityTier')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2 flex flex-col items-start text-sm">
            {universityTiers.map((tier) => (
              <button
                key={tier}
                onClick={() => handleUniversityTierChange(tier)}
                className={`${searchParams.universityTier.includes(tier) ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
        
        {/* Certifications, Awards, Social Proof */}
        <div className=" space-y-2 flex flex-col items-start text-sm">
          <button
            
            onClick={() => updateSearchParams({ hasCertifications: !searchParams.hasCertifications })}
            className={` ${searchParams.hasCertifications ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
          >
            Has Certifications
          </button>
          
          <button
            
            onClick={() => updateSearchParams({ hasAwards: !searchParams.hasAwards })}
            className={` ${searchParams.hasAwards ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
          >
            Has Awards
          </button>
          
          <button
            
            onClick={() => updateSearchParams({ hasSocialProof: !searchParams.hasSocialProof })}
            className={` ${searchParams.hasSocialProof ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
          >
            Has Social Proof
          </button>
        </div>
        
        {/* Current Salary */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-700">Current Salary</h3>
            {searchParams.currentSalaryRange.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('currentSalaryRange')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2  flex flex-col items-start text-sm">
            {salaryRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleSalaryRangeChange(range)}
                className={` justify-start ${searchParams.currentSalaryRange.includes(range) ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        {/* Expected CTC */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Expected CTC</h3>
            {searchParams.expectedCTCRange.length > 0 && (
              <button
                className="text-blue-500 text-sm hover:underline"
                onClick={() => clearSection('expectedCTCRange')}
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2  flex flex-col items-start text-sm">
            {salaryRanges.map((range) => (
              <button
                key={range}
               
                onClick={() => handleExpectedCTCChange(range)}
                className={`justify-start ${searchParams.expectedCTCRange.includes(range) ? 'bg-blue-400 text-white px-2 text-sm rounded-[4px]' : ''}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};