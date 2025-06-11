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

  const toggleTopTierOnly = (checked: boolean) => {
    console.log('toggleTopTierOnly called with checked:', checked);
    console.log('Before update - searchParams.topTierOnly:', searchParams.topTierOnly);
    updateSearchParams({ topTierOnly: checked });
    console.log('After update - searchParams.topTierOnly:', checked);
  };

  // Log when component renders and searchParams changes
  React.useEffect(() => {
    console.log('FilterSidebar rendered with searchParams:', searchParams);
  }, [searchParams]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-4 h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar sticky top-28"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
      <div className="space-y-6">
        {/* University Tier */}
        <div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={searchParams.topTierOnly}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleTopTierOnly(e.target.checked)}  
              className="h-4 w-4 text-[#4f46e5] border-gray-300 rounded"
              id="topTierOnly"
            />
            <label htmlFor="topTierOnly" className="text-sm text-gray-600">Only Top Tier</label>
          </div>
        </div>
      </div>

      <p className="flex gap-2 bg-white rounded-lg shadow-md px-1 py-4 animate-pulse">More Filters Coming Soon</p>

      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex gap-2 bg-white rounded-lg shadow-md px-1 py-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>

      
    </motion.aside>
  );
};

const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);

