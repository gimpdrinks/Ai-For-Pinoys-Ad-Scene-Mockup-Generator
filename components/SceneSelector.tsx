import React from 'react';
import type { Scene } from '../types';

interface SceneSelectorProps {
  scenes: Scene[];
  selectedScene: string | null;
  onSelectScene: (sceneId: string) => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({ scenes, selectedScene, onSelectScene }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          onClick={() => onSelectScene(scene.id)}
          aria-pressed={selectedScene === scene.id}
          title={scene.description}
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400 ${
            selectedScene === scene.id ? 'ring-4 ring-sky-500 scale-105' : 'ring-2 ring-slate-700 hover:ring-sky-600'
          }`}
        >
          <img src={scene.thumbnail} alt={scene.name} className="w-full h-24 md:h-32 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2">
            <h3 className="text-white text-sm md:text-base font-semibold text-center">{scene.name}</h3>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SceneSelector;