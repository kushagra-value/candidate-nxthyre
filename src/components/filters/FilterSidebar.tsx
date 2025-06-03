import React from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, Briefcase, GraduationCap } from 'lucide-react';
import { Checkbox } from '../ui/Checkbox';
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

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-7rem)] overflow-y-auto sticky top-28"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
      
      <div className="space-y-6">
        {/* Industry */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Industry</h3>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
            {industries.map((industry) => (
              <Checkbox
                key={industry}
                label={industry}
                checked={searchParams.industry.includes(industry)}
                onChange={() => handleIndustryChange(industry)}
              />
            ))}
          </div>
        </div>
        
        {/* Education Level */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Education Level</h3>
          <div className="space-y-2">
            {educationLevels.map((education) => (
              <Checkbox
                key={education}
                label={education}
                checked={searchParams.educationLevel.includes(education)}
                onChange={() => handleEducationChange(education)}
              />
            ))}
          </div>
        </div>
        
        {/* Verification Status */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Verification Status</h3>
          <div className="space-y-2">
            <Checkbox
              label="Email Verified"
              icon={<Mail size={14} className="text-indigo-500" />}
              checked={searchParams.verificationStatus.email}
              onChange={(e) => handleVerificationChange('email', e.target.checked)}
            />
            <Checkbox
              label="LinkedIn Verified"
              icon={<Check size={14} className="text-blue-500" />}
              checked={searchParams.verificationStatus.linkedin}
              onChange={(e) => handleVerificationChange('linkedin', e.target.checked)}
            />
            <Checkbox
              label="Employment History Verified"
              icon={<Briefcase size={14} className="text-green-500" />}
              checked={searchParams.verificationStatus.employment}
              onChange={(e) => handleVerificationChange('employment', e.target.checked)}
            />
            <Checkbox
              label="Education Background Verified"
              icon={<GraduationCap size={14} className="text-amber-500" />}
              checked={searchParams.verificationStatus.education}
              onChange={(e) => handleVerificationChange('education', e.target.checked)}
            />
          </div>
        </div>
        
        {/* Employment Gaps */}
        <div>
          <Button
            variant={searchParams.employmentGaps ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateSearchParams({ employmentGaps: !searchParams.employmentGaps })}
            className="w-full"
          >
            No Employment Gaps
          </Button>
        </div>
        
        {/* Skills */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Skills</h3>
          <TagInput
            tags={searchParams.skills}
            onChange={(tags) => updateSearchParams({ skills: tags })}
            placeholder="Add skills..."
          />
        </div>
        
        {/* Graduation Year */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Graduation Year</h3>
          <RangeSlider
            min={2010}
            max={2024}
            value={searchParams.graduationYearRange}
            onChange={(value) => updateSearchParams({ graduationYearRange: value })}
          />
        </div>
        
        {/* University */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">University</h3>
          <Input
            placeholder="Search university..."
            value={searchParams.university}
            onChange={(e) => updateSearchParams({ university: e.target.value })}
          />
        </div>
        
        {/* University Tier */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">University Tier</h3>
          <div className="flex flex-wrap gap-2">
            {universityTiers.map((tier) => (
              <Button
                key={tier}
                variant={searchParams.universityTier.includes(tier) ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleUniversityTierChange(tier)}
              >
                {tier}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Certifications, Awards, Social Proof */}
        <div className="space-y-2">
          <Button
            variant={searchParams.hasCertifications ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateSearchParams({ hasCertifications: !searchParams.hasCertifications })}
            className="w-full"
          >
            Has Certifications
          </Button>
          
          <Button
            variant={searchParams.hasAwards ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateSearchParams({ hasAwards: !searchParams.hasAwards })}
            className="w-full"
          >
            Has Awards
          </Button>
          
          <Button
            variant={searchParams.hasSocialProof ? 'primary' : 'outline'}
            size="sm"
            onClick={() => updateSearchParams({ hasSocialProof: !searchParams.hasSocialProof })}
            className="w-full"
          >
            Has Social Proof
          </Button>
        </div>
        
        {/* Current Salary */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Salary</h3>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <Checkbox
                key={range}
                label={range}
                checked={searchParams.currentSalaryRange.includes(range)}
                onChange={() => handleSalaryRangeChange(range)}
              />
            ))}
          </div>
        </div>
        
        {/* Expected CTC */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Expected CTC</h3>
          <div className="space-y-2">
            {salaryRanges.map((range) => (
              <Checkbox
                key={range}
                label={range}
                checked={searchParams.expectedCTCRange.includes(range)}
                onChange={() => {
                  const updated = searchParams.expectedCTCRange.includes(range)
                    ? searchParams.expectedCTCRange.filter(r => r !== range)
                    : [...searchParams.expectedCTCRange, range];
                  updateSearchParams({ expectedCTCRange: updated });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};