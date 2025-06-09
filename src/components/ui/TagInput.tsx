import React, { useState, useRef, KeyboardEvent, ReactNode } from 'react';
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
  icon?: ReactNode;
}

export const TagInput = ({
  tags,
  onChange,
  placeholder = 'Add a tag...',
  className = '',
  classNameSuggestions = '',
  suggestions = [],
  label,
  icon,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
    setIsOpen(false);
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
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-600 mb-1 text-lg">
          {label}
        </label>
      )}
      
      <div 
        className={`
          w-full bg-white rounded-md shadow-lg p-3 
          focus-within:ring-2 focus-within:ring-indigo-500 
          focus-within:border-indigo-500 transition-all duration-200
          flex items-center
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {icon && (
          <div className="flex-shrink-0 mr-2 text-gray-400">
            {icon}
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div 
            className="
              flex gap-2 items-center 
              overflow-x-auto scrollbar-hide 
              flex-nowrap
            "
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
          >
            <AnimatePresence>
              {tags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex-shrink-0"
                >
                  <Tag
                    label={tag}
                    onRemove={() => removeTag(index)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="relative flex items-center flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                onKeyDown={handleKeyDown}
                className="
                  border-none p-1 
                  focus:outline-none focus:ring-0 
                  text-gray-900 placeholder:text-gray-400 text-md
                  min-w-[150px] flex-grow
                "
                placeholder={tags.length === 0 ? placeholder : ''}
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
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-150"
              >
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute z-20 left-0 right-0 mt-2 bg-white 
              shadow-lg rounded-md max-w-full max-h-48 overflow-auto 
              border border-gray-200 ${classNameSuggestions}
            `}
          >
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="
                  px-4 py-2.5 text-md cursor-pointer 
                  hover:bg-indigo-50 hover:text-indigo-700 
                  text-gray-700 transition-colors duration-150
                "
                onClick={() => {
                  addTag(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
document.head.appendChild(style);