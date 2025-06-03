import React, { useState, useRef, KeyboardEvent } from 'react';
import { Tag } from './Tag';
import { PlusCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
  label?: string;
}

export const TagInput = ({
  tags,
  onChange,
  placeholder = 'Add a tag...',
  className = '',
  suggestions = [],
  label
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div 
        className="w-full border border-gray-300 rounded-md p-2 bg-white focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
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
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            className="flex-grow border-none p-1 focus:outline-none focus:ring-0 text-gray-800 placeholder:text-gray-400"
            placeholder={placeholder}
          />
          
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
          
          {inputValue && (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="p-1 text-indigo-500 hover:text-indigo-700"
            >
              <PlusCircle size={18} />
            </button>
          )}
        </div>
        
        {/* Suggestions list */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-48 overflow-auto"
            >
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 text-gray-700"
                  onClick={() => addTag(suggestion)}
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