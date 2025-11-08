import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-6 mt-auto border-t border-slate-700">
      <p className="text-slate-400">
        Created by{' '}
        <a
          href="https://aiforpinoys.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 transition-colors"
        >
          @AiForPinoys
        </a>
      </p>
    </footer>
  );
};

export default Footer;
