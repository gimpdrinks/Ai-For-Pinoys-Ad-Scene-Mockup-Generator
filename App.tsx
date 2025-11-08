import React, { useReducer, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptInput from './components/PromptInput';
import GeneratedAd from './components/GeneratedAd';
import ErrorAlert from './components/ErrorAlert';
import SceneSelector from './components/SceneSelector';
import SessionLibrary from './components/SessionLibrary';
import ComparisonModal from './components/ComparisonModal';
import Footer from './components/Footer';
import { generateAdMockup } from './services/geminiService';
import type { GeneratedAdContent } from './types';
import { SCENES } from './constants';
import { parseBase64 } from './utils';

// --- State Management (Reducer) ---

interface AppState {
  productImagePreview: string | null;
  imageFile: File | null;
  selectedScene: string | null;
  adPrompt: string;
  additionalInstructions: string;
  generatedAd: GeneratedAdContent | null;
  isLoading: boolean;
  error: string | null;
  sessionImages: GeneratedAdContent[];
  comparisonImageIds: string[];
}

const initialState: AppState = {
  productImagePreview: null,
  imageFile: null,
  selectedScene: 'edsa-billboard', // Default scene
  adPrompt: '',
  additionalInstructions: '',
  generatedAd: null,
  isLoading: false,
  error: null,
  sessionImages: [],
  comparisonImageIds: [],
};

type AppAction =
  | { type: 'SET_IMAGE'; payload: { file: File; previewUrl: string } }
  | { type: 'SET_IMAGE_ERROR'; payload: { error: string } }
  | { type: 'SET_SCENE'; payload: { sceneId: string | null } }
  | { type: 'SET_AD_PROMPT'; payload: { prompt: string } }
  | { type: 'SET_ADDITIONAL_INSTRUCTIONS'; payload: { instructions: string } }
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_SUCCESS'; payload: { newAd: GeneratedAdContent } }
  | { type: 'GENERATION_ERROR'; payload: { error: string } }
  | { type: 'CLEAR_ERROR' }
  | { type: 'DELETE_SESSION_IMAGE'; payload: { id: string } }
  | { type: 'CLEAR_SESSION' }
  | { type: 'TOGGLE_COMPARE'; payload: { id: string } }
  | { type: 'CLEAR_COMPARISON' };

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_IMAGE':
            return {
                ...state,
                imageFile: action.payload.file,
                productImagePreview: action.payload.previewUrl,
                error: null,
            };
        case 'SET_IMAGE_ERROR':
            return {
                ...state,
                imageFile: null,
                productImagePreview: null,
                error: action.payload.error,
            };
        case 'SET_SCENE':
            return {
                ...state,
                selectedScene: action.payload.sceneId,
            };
        case 'SET_AD_PROMPT':
            return {
                ...state,
                adPrompt: action.payload.prompt,
            };
        case 'SET_ADDITIONAL_INSTRUCTIONS':
            return {
                ...state,
                additionalInstructions: action.payload.instructions,
            };
        case 'START_GENERATION':
            return {
                ...state,
                isLoading: true,
                error: null,
                generatedAd: null,
            };
        case 'GENERATION_SUCCESS':
            return {
                ...state,
                isLoading: false,
                generatedAd: action.payload.newAd,
                sessionImages: [action.payload.newAd, ...state.sessionImages],
            };
        case 'GENERATION_ERROR':
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'DELETE_SESSION_IMAGE':
            const { id } = action.payload;
            return {
                ...state,
                sessionImages: state.sessionImages.filter(img => img.id !== id),
                comparisonImageIds: state.comparisonImageIds.filter(compId => compId !== id),
                generatedAd: state.generatedAd?.id === id ? null : state.generatedAd,
            };
        case 'CLEAR_SESSION':
            return {
                ...state,
                sessionImages: [],
                generatedAd: null,
                comparisonImageIds: [],
            };
        case 'TOGGLE_COMPARE':
            const compId = action.payload.id;
            const isComparing = state.comparisonImageIds.includes(compId);
            return {
                ...state,
                comparisonImageIds: isComparing
                    ? state.comparisonImageIds.filter(id => id !== compId)
                    : [...state.comparisonImageIds, compId],
            };
        case 'CLEAR_COMPARISON':
            return {
                ...state,
                comparisonImageIds: [],
            };
        default:
            return state;
    }
}


const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const {
      productImagePreview,
      imageFile,
      selectedScene,
      adPrompt,
      additionalInstructions,
      generatedAd,
      isLoading,
      error,
      sessionImages,
      comparisonImageIds
  } = state;

  const handleImageUpload = useCallback((file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      dispatch({ type: 'SET_IMAGE_ERROR', payload: { error: 'Invalid file type. Please upload a PNG, JPG, or WEBP image.' }});
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
        dispatch({ type: 'SET_IMAGE_ERROR', payload: { error: 'File is too large. Please upload an image smaller than 5MB.' }});
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch({ type: 'SET_IMAGE', payload: { file, previewUrl: reader.result as string }});
    };
    reader.readAsDataURL(file);
  }, []);
  
  const handleGenerateAd = async () => {
    if (!imageFile || !productImagePreview || !selectedScene) {
      dispatch({ type: 'GENERATION_ERROR', payload: { error: 'Please upload an image and select an ad scene.' }});
      return;
    }

    dispatch({ type: 'START_GENERATION' });

    const scene = SCENES.find(s => s.id === selectedScene);

    if (!scene) {
        dispatch({ type: 'GENERATION_ERROR', payload: { error: 'Selected scene not found. Please select a scene again.' }});
        return;
    }
    
    const instructionsPart = additionalInstructions
      ? `\n      Fine-Tuning Instructions: "${additionalInstructions}". Attempt to follow these instructions as closely as possible, but prioritize realism and visual coherence.`
      : '';

    const detailedPrompt = `
      Task: Create a realistic product ad mockup.
      Scene: A high-resolution, photorealistic scene based on this description: "${scene.name} - ${scene.description}".
      Product Image: [The user's product image is provided as the input image].
      Ad Copy: "${adPrompt || 'Generate a compelling, short headline for the product.'}"${instructionsPart}

      Instructions:
      1.  **Image Placement**: Seamlessly integrate the product image into the scene. Pay close attention to perspective, scale, and positioning to make it look natural.
      2.  **Lighting and Shadows**: The product's lighting must match the scene's ambient light source(s). Generate realistic, soft shadows cast by the product onto its surroundings.
      3.  **Ad Copy Styling**: If ad copy is provided, style it using a font, color, and placement that is aesthetically pleasing and appropriate for a '${scene.name}' ad. If no ad copy is provided, generate a suitable one. Do NOT include the quotation marks in the final image.
      4.  **Scene Enhancement**: Enhance the final image with subtle, realistic details. For example, add reflections of the product on glossy surfaces or mimic the scene's ambient light on the product's surface. The final output should look like a real photograph.
      5.  **Output**: Return only the final, high-resolution image of the ad mockup. Do not return any text description of what you did, just the image and a text block containing the ad copy used.
    `;

    try {
      const { base64Data, mimeType } = parseBase64(productImagePreview);
      const result = await generateAdMockup(base64Data, mimeType, detailedPrompt);
      const newAd: GeneratedAdContent = {
        ...result,
        id: `ad-${Date.now()}`
      };
      dispatch({ type: 'GENERATION_SUCCESS', payload: { newAd }});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      dispatch({ type: 'GENERATION_ERROR', payload: { error: errorMessage }});
    }
  };

  const isGenerationEnabled = !!imageFile && !!selectedScene;

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top-Left: Uploader */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-sky-300">1. Upload Product Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} previewUrl={productImagePreview} />
          </div>

          {/* Top-Right: Scene Selector */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-sky-300">2. Select an Ad Scene</h2>
            <SceneSelector scenes={SCENES} selectedScene={selectedScene} onSelectScene={(id) => dispatch({ type: 'SET_SCENE', payload: { sceneId: id } })} />
          </div>
          
          {/* Bottom-Left: Customize Ad */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-sky-300">3. Customize Ad (Optional)</h2>
            <PromptInput
              prompt={adPrompt}
              setPrompt={(prompt) => dispatch({ type: 'SET_AD_PROMPT', payload: { prompt }})}
              additionalInstructions={additionalInstructions}
              setAdditionalInstructions={(instructions) => dispatch({ type: 'SET_ADDITIONAL_INSTRUCTIONS', payload: { instructions }})}
              onSubmit={handleGenerateAd}
              isLoading={isLoading}
              isGenerationEnabled={isGenerationEnabled}
            />
             {error && <ErrorAlert message={error} onDismiss={() => dispatch({ type: 'CLEAR_ERROR' })} />}
          </div>

          {/* Bottom-Right: Output */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col min-h-[500px]">
             <h2 className="text-lg font-semibold mb-4 text-sky-300 flex-shrink-0">Your AI-Generated Ad Mockup</h2>
             {isLoading ? (
               <div className="flex-grow flex flex-col items-center justify-center text-slate-400">
                 <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg">Generating your ad...</p>
                <p className="text-sm">This may take a moment.</p>
               </div>
             ) : (
                <GeneratedAd adContent={generatedAd} />
             )}
          </div>
        </div>
        {sessionImages.length > 0 && (
          <SessionLibrary 
            images={sessionImages}
            onDelete={(id) => dispatch({ type: 'DELETE_SESSION_IMAGE', payload: { id } })}
            onClear={() => dispatch({ type: 'CLEAR_SESSION' })}
            onToggleCompare={(id) => dispatch({ type: 'TOGGLE_COMPARE', payload: { id } })}
            comparisonImageIds={comparisonImageIds}
          />
        )}
      </main>
       {comparisonImageIds.length > 1 && (
        <ComparisonModal 
            images={sessionImages.filter(img => comparisonImageIds.includes(img.id))}
            onClose={() => dispatch({ type: 'CLEAR_COMPARISON' })}
        />
       )}
       <Footer />
    </div>
  );
};

export default App;