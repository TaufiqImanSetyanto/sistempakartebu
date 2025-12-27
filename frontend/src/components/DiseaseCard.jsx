import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DiseaseCard({ disease }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;
      setNeedsExpansion(element.scrollHeight > element.clientHeight);
    }
  }, [disease.solution]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-xl text-gray-800">{disease.disease}</h4>

        {needsExpansion && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 group flex-shrink-0 ml-3">
            <span className="text-sm text-gray-600 group-hover:text-gray-800">{isExpanded ? "Sembunyikan" : "Detail"}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      <div className="mt-3">
        <p ref={textRef} className={`text-gray-600 leading-relaxed transition-all duration-300 ${!isExpanded ? "line-clamp-2" : ""}`}>
          {disease.solution}
        </p>

        {isExpanded && <div className="mt-3 pt-3 border-t border-gray-200"></div>}
      </div>
    </div>
  );
}
