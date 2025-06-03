import React from 'react';
import ReactSlider from 'react-slider';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

export const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  minLabel,
  maxLabel,
  className = ''
}: RangeSliderProps) => {
  return (
    <div className={`w-full ${className}`}>
      <ReactSlider
        className="h-7 flex items-center"
        thumbClassName="w-5 h-5 bg-white border-2 border-indigo-500 rounded-full cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 active:cursor-grabbing"
        trackClassName="h-1 bg-gray-200 rounded-full"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange as (value: number | readonly number[]) => void}
        pearling
        minDistance={1}
      />
      
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        <div className="flex flex-col items-start">
          <span>{minLabel || min}</span>
          <span className="font-medium text-sm text-gray-800">{value[0]}</span>
        </div>
        <div className="flex flex-col items-end">
          <span>{maxLabel || max}</span>
          <span className="font-medium text-sm text-gray-800">{value[1]}</span>
        </div>
      </div>
    </div>
  );
};