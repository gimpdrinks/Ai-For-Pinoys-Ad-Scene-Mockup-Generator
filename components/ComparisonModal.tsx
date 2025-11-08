import React from 'react';
import type { GeneratedAdContent } from '../types';

interface ComparisonModalProps {
  images: GeneratedAdContent[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ images, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-slate-900 p-4 md:p-6 rounded-xl max-w-7xl w-full mx-4 max-h-[90vh] flex flex-col border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-sky-400">Compare Ads</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close comparison view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-auto">
            <div className={`grid grid-cols-1 md:grid-cols-${images.length > 1 ? 2 : 1} lg:grid-cols-${images.length > 3 ? 3 : images.length} gap-4`}>
                {images.map(ad => ad.imageUrl && (
                    <div key={ad.id} className="bg-slate-800 rounded-lg overflow-hidden animate-fade-in">
                        <img src={ad.imageUrl} alt={`Comparison ad ${ad.id}`} className="w-full h-auto object-contain" />
                        {ad.text && (
                          <div className="p-4">
                            <p className="text-sm text-slate-300">{ad.text}</p>
                          </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
        <div className="mt-6 flex-shrink-0 text-center">
            <button 
                onClick={onClose} 
                className="px-6 py-2 text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors"
            >
                Done Comparing
            </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;