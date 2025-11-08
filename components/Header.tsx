import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-slate-700">
      <img
        src="https://res.cloudinary.com/dbylka4xx/image/upload/v1751883360/AiForPinoys_Logo_ttg2id.png"
        alt="AiForPinoys Logo"
        className="h-16 mx-auto mb-4"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
        Ad Scene Mockup Generator
      </h1>
      <p className="mt-2 text-lg text-slate-400">
        See your ads in the wild, before they go live.
      </p>
    </header>
  );
};

export default Header;