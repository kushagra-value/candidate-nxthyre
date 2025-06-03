import React, { useState, useRef, KeyboardEvent } from 'react';
import { Tag } from './Tag';
import { PlusCircle, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  classNameSuggestions?: string;
  suggestions?: string[];
  label?: string;
}

export const TagInput = ({
  tags,
  onChange,
  placeholder = 'Add a tag...',
  className = '',
  classNameSuggestions = '',
  suggestions = [],
  label
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false); // New state for controlling suggestions dropdown
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const filteredSuggestions = suggestions
    .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
    .filter(s => !tags.includes(s));

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
      )}
      
      <div 
        className={`w-full ${classNameSuggestions} rounded-md p-3 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200 shadow-sm`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
              >
                <Tag
                  label={tag}
                  onRemove={() => removeTag(index)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true); // Show suggestions when typing
            }}
            onFocus={() => setIsOpen(true)} // Show suggestions on focus
            onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Hide suggestions after a delay
            onKeyDown={handleKeyDown}
            className="flex-grow border-none p-1 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-400 text-sm"
            placeholder={placeholder}
          />
          
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <X size={16} />
            </button>
          )}
          
          {inputValue && (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
            >
              <PlusCircle size={18} />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)} // Toggle suggestions
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
            />
          </button>
        </div>
        
        <AnimatePresence>
          {isOpen && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-20 left-0 right-0 mt-2 bg-white shadow-lg rounded-md max-h-48 overflow-auto border border-gray-200"
            >
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="px-4 py-2.5 text-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 text-gray-700 transition-colors duration-150"
                  onClick={() => {
                    addTag(suggestion);
                    setIsOpen(false); // Close suggestions after selecting
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};