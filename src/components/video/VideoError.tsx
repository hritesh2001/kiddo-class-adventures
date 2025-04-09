
import React from 'react';

type VideoErrorProps = {
  errorMessage: string;
  onRetry: () => void;
};

export const VideoError: React.FC<VideoErrorProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="bg-red-100 p-4 text-red-800 rounded-lg">
      <p>{errorMessage}</p>
      <button 
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
};
