"use client";

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface ProductAccordionProps {
  title: string;
  content: React.ReactNode;
}

export function ProductAccordion({ title, content }: ProductAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-2 border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-4 text-xs font-bold uppercase tracking-wider text-black focus:outline-none"
      >
        {title} 
        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
      </button>
      
      {/* Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-4 text-sm font-medium text-black/80 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
