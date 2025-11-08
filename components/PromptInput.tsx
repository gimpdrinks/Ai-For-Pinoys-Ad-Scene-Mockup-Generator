import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  additionalInstructions: string;
  setAdditionalInstructions: (instructions: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isGenerationEnabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  additionalInstructions,
  setAdditionalInstructions,
  onSubmit, 
  isLoading, 
  isGenerationEnabled 
}) => {
  const isDisabled = isLoading || !isGenerationEnabled;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="ad-copy" className="block text-sm font-medium text-slate-300 mb-1">Ad Copy</label>
        <textarea
          id="ad-copy"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'The future of timekeeping.' or leave blank."
          rows={2}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
      </div>
       <div>
        <label htmlFor="additional-instructions" className="block text-sm font-medium text-slate-300 mb-1">Additional Instructions</label>
        <textarea
          id="additional-instructions"
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          placeholder="e.g., 'Change the background to light blue.' or 'Place the product on a wooden table.'"
          rows={3}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Ad Mockup'
        )}
      </button>
    </div>
  );
};

export default PromptInput;