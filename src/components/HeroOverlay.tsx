import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TagInput } from './ui/TagInput';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import { useSearch } from '../context/SearchContext';
import { SearchIcon } from 'lucide-react';

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
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        when: "beforeChildren", 
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.2, 
        when: "afterChildren", 
        staggerChildren: 0.05, 
        staggerDirection: -1 
      }
    }
  };
  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 10, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 md:p-8"
      >
        <motion.div variants={itemVariants} className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center">
            Find your perfect candidate
          </h1>
        </motion.div>

        

        <div className="space-y-6">
          <div className="hero-input relative z-30">
            <TagInput
              label="Required Skills"
              tags={searchParams.skills}
              onChange={(tags) => updateSearchParams({ skills: tags })}
              placeholder="Add skills (e.g., React, Python, AWS)"
              suggestions={skillOptions}
              classNameSuggestions='border border-gray-300'
            />
          </div>

          <div className="hero-input relative z-20">
            <TagInput
              label="Location"
              tags={searchParams.location.split(',').filter(Boolean)}
              onChange={(locations) => updateSearchParams({ location: locations.join(',') })}
              placeholder="City, State or Remote"
              suggestions={locationOptions}
              classNameSuggestions="border border-gray-300"
            />
          </div>

          <div className="hero-input relative z-10">
            <label className="block text-sm font-medium text-gray-600 mb-2">Experience</label>
            <Dropdown
              options={experienceOptions}
              value={`${searchParams.experienceRange[1]} years`}
              onChange={(value) => {
                const years = parseInt(value);
                updateSearchParams({ experienceRange: [0, years] });
              }}
              placeholder="Select experience..."
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              dropdownClassName="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
            />
          </div>

          <div className="w-full pt-3 flex justify-left relative z-0">
            <Button
              size="lg"
              onClick={handleSearch}
              className="btn-primary w-full flex items-center justify-center py-3 text-base"
            >
              
              <SearchIcon size={18} className="mr-2" />
            
              Search Candidates
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
