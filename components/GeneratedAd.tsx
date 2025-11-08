import React from 'react';
import type { GeneratedAdContent } from '../types';

interface GeneratedAdProps {
  adContent: GeneratedAdContent | null;
}

const GeneratedAd: React.FC<GeneratedAdProps> = ({ adContent }) => {
  if (!adContent) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-800 rounded-lg p-8 text-slate-400">
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l2 2m-2-2l-2-2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-300">Your generated ad will appear here</h3>
            <p className="mt-1 text-sm text-slate-500">Upload an image and provide a prompt to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl animate-fade-in">
      {adContent.imageUrl && (
        <div className="relative group aspect-square">
          <img src={adContent.imageUrl} alt="Generated ad mockup" className="w-full h-full object-cover" />
           <a
              href={adContent.imageUrl}
              download={`ad-mockup-${adContent.id}.png`}
              title="Download"
              aria-label="Download ad mockup"
              className="absolute top-4 right-4 p-3 bg-slate-900/70 rounded-full text-white hover:bg-sky-600 transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
        </div>
      )}
      {adContent.text && (
        <div className="p-6">
          <h3 className="text-lg font-semibold text-sky-400 mb-2">Generated Ad Copy</h3>
          <p className="text-slate-300 whitespace-pre-wrap">{adContent.text}</p>
        </div>
      )}
    </div>
  );
};

export default GeneratedAd;