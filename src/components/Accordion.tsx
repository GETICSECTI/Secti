import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

export interface AccordionItem {
  id: number;
  pergunta: string;
  resposta: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion = ({ items }: AccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Header/Question */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full cursor-pointer px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors duration-200"
            aria-expanded={activeIndex === index}
          >
            <span className="font-semibold text-[#0C2856] pr-4 text-base md:text-lg">
              {item.pergunta}
            </span>
            <FontAwesomeIcon
              icon={activeIndex === index ? faChevronUp : faChevronDown}
              className="text-[#195CE3] flex-shrink-0 transition-transform duration-200"
            />
          </button>

          {/* Content/Answer */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              activeIndex === index ? 'opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: item.resposta }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
