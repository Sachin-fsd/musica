"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextItem = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevItem = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute bg-red-500 inset-y-0 left-0 flex items-center justify-center">
        <button onClick={prevItem} className="p-2">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      <div className="absolute bg-blue-500 inset-y-0 right-0 flex items-center justify-center">
        <button onClick={nextItem} className="p-2">
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div key={index} className="min-w-full flex justify-center p-4">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomCarousel;
