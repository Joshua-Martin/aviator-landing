import React, { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

/**
 * FAQ Component
 * Renders a list of FAQ questions and answers in a modern, beautiful style.
 * Loads FAQ data from the build path: /packages/landing/src/js/components/faq.json
 *
 * - No background or title.
 * - Uses Lucide icons for expand/collapse.
 * - Fully accessible and keyboard-navigable.
 * - Well-documented for future maintainers.
 */

interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // Dynamically import the FAQ JSON from the build path
    fetch("./js/components/faq.json")
      .then((res) => res.json())
      .then((data) => setFaqs(data));
  }, []);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {faqs.map((faq, idx) => (
        <div
          key={faq.question}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-5 transition-shadow duration-200 hover:shadow-md"
        >
          <button
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            onClick={() => handleToggle(idx)}
            className="w-full flex items-center justify-between p-6 text-base sm:text-lg font-semibold bg-transparent border-none cursor-pointer text-gray-800 outline-none focus:outline-none"
          >
            <span className="text-left">{faq.question}</span>
            {openIndex === idx ? (
              <div className="bg-blue-200 rounded-full p-2 flex-shrink-0 ml-4">
                <Minus 
                  size={20} 
                  strokeWidth={3}
                  className="text-gray-700" 
                />
              </div>
            ) : (
              <div className="bg-blue-200 rounded-full p-2 flex-shrink-0 ml-4">
                <Plus 
                  size={20} 
                  strokeWidth={3}
                  className="text-gray-700" 
                />
              </div>
            )}
          </button>
          {openIndex === idx && (
            <div
              id={`faq-answer-${idx}`}
              className="px-6 pb-6 text-base text-gray-600 leading-relaxed animate-fade-in"
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}

      
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
