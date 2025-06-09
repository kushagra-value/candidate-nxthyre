import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  classNameSuggestions?: string;
  textSuggestions?: string;
  dropdownClassName?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  classNameSuggestions = '',
  textSuggestions = '',
  dropdownClassName = ''
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        className={`w-full flex justify-between items-center px-3 py-2 rounded-lg bg-white text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${classNameSuggestions}`}
        onClick={toggleDropdown}
      >
        <span className={` ${value ? 'text-gray-600' : 'text-gray-500 '} ${textSuggestions}`}>
          {value || placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto ${dropdownClassName || ''}`}
          >
            {options.map((option) => (
              <div
                key={option}
                className={`
                  px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50
                  ${value === option ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}
                `}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};