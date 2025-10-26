
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default Loader;
