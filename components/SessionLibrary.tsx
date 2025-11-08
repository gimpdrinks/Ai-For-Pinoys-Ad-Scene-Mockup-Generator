import React from 'react';
import type { GeneratedAdContent } from '../types';

interface SessionLibraryProps {
  images: GeneratedAdContent[];
  onDelete: (id: string) => void;
  onClear: () => void;
  onToggleCompare: (id: string) => void;
  comparisonImageIds: string[];
}

const SessionLibrary: React.FC<SessionLibraryProps> = ({ 
    images, 
    onDelete, 
    onClear,
    onToggleCompare,
    comparisonImageIds
}) => {
  return (
    <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-sky-300">Session Image Library</h2>
        <button 
          onClick={onClear} 
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-colors"
        >
          Clear Session
        </button>
      </div>
      <div className="flex overflow-x-auto space-x-4 p-2 -m-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {images.map((ad) => ad.imageUrl && (
          <div key={ad.id} className="relative flex-shrink-0 w-48 h-48 group bg-slate-700 rounded-lg overflow-hidden">
            <img src={ad.imageUrl} alt="Generated ad thumbnail" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col items-center justify-center p-2">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                    type="checkbox"
                    checked={comparisonImageIds.includes(ad.id)}
                    onChange={() => onToggleCompare(ad.id)}
                    className="form-checkbox h-5 w-5 bg-slate-600 border-slate-400 text-sky-500 rounded focus:ring-sky-500"
                    title="Select to compare"
                />
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={ad.imageUrl}
                  download={`ad-mockup-${ad.id}.png`}
                  title="Download"
                  className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-sky-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                <button
                  onClick={() => onDelete(ad.id)}
                  title="Delete"
                  className="p-2 bg-slate-800/80 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
       {comparisonImageIds.length > 0 &&
         <p className="text-sm text-slate-400 mt-3">
           {comparisonImageIds.length > 1 ? `Comparing ${comparisonImageIds.length} images. The comparison view is now active.` : `Select one more image to start comparing.`}
        </p>
       }
    </div>
  );
};

export default SessionLibrary;