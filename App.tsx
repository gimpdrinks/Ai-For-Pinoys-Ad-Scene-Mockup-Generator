import React, { useState, useCallback } from 'react';
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
import type { GeneratedAdContent, Scene } from './types';

const SCENES: Scene[] = [
    { 
        id: 'edsa-billboard', 
        name: 'EDSA Highway Billboard', 
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584143/EDSA_zxvubm.png',
        description: 'A massive digital billboard along the busy EDSA highway in Manila, surrounded by heavy traffic and urban scenery.'
    },
    { 
        id: 'bus-stop', 
        name: 'Bus Stop Ad', 
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584141/Bus_Stop_nu8xvf.png',
        description: 'A printed advertisement displayed inside a bus stop shelter.'
    },
    { 
        id: 'magazine-spread', 
        name: 'Glossy Magazine Spread', 
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584143/Magazine_jrqbfe.png',
        description: 'A two-page ad in a high-end fashion or lifestyle magazine.'
    },
    { 
        id: 'subway-poster', 
        name: 'Subway Car Poster', 
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584151/Subway_iwypgo.png',
        description: 'An advertisement poster displayed inside a subway car.'
    },
    {
        id: 'vintage-newspaper',
        name: 'Vintage Newspaper Ad',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584151/Vintage_rpc7sz.png',
        description: 'A black-and-white advertisement in an old-fashioned newspaper style.'
    },
    { 
        id: 'social-media-story', 
        name: 'Social Media Story', 
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584147/Social_Media_Story_h7q0ev.png',
        description: 'A full-screen vertical ad on platforms like Instagram or Snapchat.'
    },
    {
        id: 'airport-carousel',
        name: 'Airport Luggage Carousel',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584141/Airport_l06218.png',
        description: 'An advertisement displayed on the moving luggage carousel at an airport.'
    },
    {
        id: 'coffee-shop-stand',
        name: 'Coffee Shop Table Stand',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584141/Coffee_Shop_xb5fgk.png',
        description: 'A small, triangular advertisement placed on tables in a coffee shop.'
    },
    {
        id: 'movie-theater-screen',
        name: 'Movie Theater Screen',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584143/Moviehouse_wca3kz.png',
        description: 'A pre-movie advertisement shown on the big screen in a cinema.'
    },
    {
        id: 'stadium-jumbotron',
        name: 'Stadium Jumbotron',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584146/Stadium_xkfwgs.png',
        description: 'A large video screen in a sports stadium.'
    },
    {
        id: 'social-feed-post',
        name: 'Social Media Feed Post',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584145/Social_Media_Feed_yw2mhb.png',
        description: 'A typical image or video ad in an Instagram or Facebook feed.'
    },
    {
        id: 'tiktok-ad',
        name: 'TikTok Vertical Ad',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584146/TikTok_Ad_c33nar.png',
        description: 'A short-form video ad designed for the TikTok platform.'
    },
    {
        id: 'ecommerce-page',
        name: 'E-Commerce Product Page',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584141/ECommerce_dntvn0.png',
        description: 'A realistic mockup of the product on an e-commerce website page.'
    },
    {
        id: 'email-banner',
        name: 'Email Banner Ad',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584143/Email_Banner_fcjpru.png',
        description: 'A horizontal advertisement banner for use in email marketing.'
    },
    {
        id: 'youtube-thumbnail',
        name: 'YouTube Pre-Roll Thumbnail',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584148/Youtube_sj6kxx.png',
        description: 'The still image thumbnail displayed before a YouTube video ad plays.'
    },
    {
        id: 'mobile-banner',
        name: 'In-App Mobile Banner',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584141/In_App_orpgsb.png',
        description: 'A small advertisement banner displayed within a mobile app.'
    },
    {
        id: 'highway-billboard',
        name: 'Highway Billboard',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584141/Highway_lsugjw.png',
        description: 'A large billboard located alongside a highway.'
    },
    {
        id: 'retail-display',
        name: 'Retail Shelf Display',
        thumbnail: 'https://res.cloudinary.com/dbylka4xx/image/upload/v1760584143/Retail_Shelf_vuujkt.png',
        description: 'An ad on a shelf or display within a retail store (end-cap or signage).'
    },
];

const App: React.FC = () => {
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>('edsa-billboard');
  const [adPrompt, setAdPrompt] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [generatedAd, setGeneratedAd] = useState<GeneratedAdContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionImages, setSessionImages] = useState<GeneratedAdContent[]>([]);
  const [comparisonImageIds, setComparisonImageIds] = useState<string[]>([]);

  const handleImageUpload = useCallback((file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PNG, JPG, or WEBP image.');
      return;
    }
    setError(null);
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);
  
  const parseBase64 = (dataUrl: string): { base64Data: string; mimeType: string } => {
    const parts = dataUrl.split(',');
    if (parts.length !== 2) throw new Error('Invalid Data URL');
    const mimeType = parts[0].split(':')[1].split(';')[0];
    return { base64Data: parts[1], mimeType };
  };

  const handleGenerateAd = async () => {
    if (!imageFile || !productImagePreview || !selectedScene) {
      setError('Please upload an image and select an ad scene.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedAd(null);

    const scene = SCENES.find(s => s.id === selectedScene);

    if (!scene) {
        setError('Selected scene not found. Please select a scene again.');
        setIsLoading(false);
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
      setGeneratedAd(newAd);
      setSessionImages(prev => [newAd, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (id: string) => {
    setSessionImages(prev => prev.filter(img => img.id !== id));
    setComparisonImageIds(prev => prev.filter(compId => compId !== id));
    if (generatedAd?.id === id) {
        setGeneratedAd(null);
    }
  };

  const handleClearSession = () => {
    setSessionImages([]);
    setGeneratedAd(null);
    setComparisonImageIds([]);
  };

  const handleToggleCompare = (id: string) => {
    setComparisonImageIds(prev =>
        prev.includes(id) ? prev.filter(compId => compId !== id) : [...prev, id]
    );
  };

  const handleClearComparison = () => {
    setComparisonImageIds([]);
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
            <SceneSelector scenes={SCENES} selectedScene={selectedScene} onSelectScene={setSelectedScene} />
          </div>
          
          {/* Bottom-Left: Customize Ad */}
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-sky-300">3. Customize Ad (Optional)</h2>
            <PromptInput
              prompt={adPrompt}
              setPrompt={setAdPrompt}
              additionalInstructions={additionalInstructions}
              setAdditionalInstructions={setAdditionalInstructions}
              onSubmit={handleGenerateAd}
              isLoading={isLoading}
              isGenerationEnabled={isGenerationEnabled}
            />
             {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
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
            onDelete={handleDeleteImage}
            onClear={handleClearSession}
            onToggleCompare={handleToggleCompare}
            comparisonImageIds={comparisonImageIds}
          />
        )}
      </main>
       {comparisonImageIds.length > 1 && (
        <ComparisonModal 
            images={sessionImages.filter(img => comparisonImageIds.includes(img.id))}
            onClose={handleClearComparison}
        />
       )}
       <Footer />
    </div>
  );
};

export default App;