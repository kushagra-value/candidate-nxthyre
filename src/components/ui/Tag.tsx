import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

const variantClasses = {
  default: 'bg-indigo-100 text-indigo-800',
  outline: 'bg-transparent border border-gray-300 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800'
};

const sizeClasses = {
  sm: 'text-xs py-0.5 px-2',
  md: 'text-sm py-1 px-2.5'
};

export const Tag = ({ 
  label, 
  onRemove, 
  variant = 'default',
  size = 'md'
}: TagProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`
        inline-flex items-center rounded-md font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${onRemove ? 'pr-1' : ''}
      `}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="sr-only">Remove {label}</span>
          <X size={12} />
        </button>
      )}
    </motion.div>
  );
};