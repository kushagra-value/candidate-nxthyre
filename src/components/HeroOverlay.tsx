import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TagInput } from './ui/TagInput';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import { useSearch } from '../context/SearchContext';

interface HeroOverlayProps {
  onClose: () => void;
}

const skillOptions = [
  'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision',
  'Neural Networks', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Data Mining',
  'Big Data Analytics', 'Reinforcement Learning', 'AI Ethics', 'Robotics',
  'Speech Recognition', 'Image Processing', 'Predictive Analytics',
  'AI Model Deployment', 'MLOps', 'AI Infrastructure', 'AI Research'
];

const locationOptions = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Gurgaon', 'Noida', 'Chandigarh', 'Kochi', 'Thiruvananthapuram',
  'Coimbatore', 'Jaipur', 'Indore', 'Bhubaneswar', 'Lucknow', 'Nagpur', 'Vizag'
];

const experienceOptions = Array.from({ length: 16 }, (_, i) => `${i} years`);

export const HeroOverlay = ({ onClose }: HeroOverlayProps) => {
  const { searchParams, updateSearchParams, executeSearch } = useSearch();

  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline
      .from('.hero-title', { opacity: 1, y: 30, duration: 0.8, ease: 'power3.out' })
      .from('.hero-input', { opacity: 1, y: 20, stagger: 0.2, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      .from('.hero-button', { opacity: 1, y: 10, duration: 0.5, ease: 'power3.out' }, '-=0.2');
      
    return () => {
      timeline.kill();
      timeline.clear();
    };
  }, []);

  const handleSearch = () => {
    executeSearch();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative z-50"
      >
        <h1 className="hero-title text-3xl font-bold text-gray-800 mb-6 text-center">
          Find your perfect candidate
        </h1>

        <div className="space-y-6">
          <div className="hero-input relative z-30">
            <TagInput
              label="Skills"
              tags={searchParams.skills}
              onChange={(tags) => updateSearchParams({ skills: tags })}
              placeholder="Select required skills..."
              suggestions={skillOptions}
            />
          </div>

          <div className="hero-input relative z-20">
            <TagInput
              label="Location"
              tags={searchParams.location.split(',').filter(Boolean)}
              onChange={(locations) => updateSearchParams({ location: locations.join(',') })}
              placeholder="Select locations..."
              suggestions={locationOptions}
            />
          </div>

          <div className="hero-input relative z-10">
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <Dropdown
              options={experienceOptions}
              value={`${searchParams.experienceRange[1]} years`}
              onChange={(value) => {
                const years = parseInt(value);
                updateSearchParams({ experienceRange: [0, years] });
              }}
              placeholder="Select experience..."
              className="w-full"
              dropdownClassName="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
            />
          </div>

          <div className="hero-button flex justify-center mt-8 relative z-0">
            <Button
              size="lg"
              onClick={handleSearch}
              className="w-full md:w-auto px-10 text-gray-800"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
