
import React from 'react';

export const VideoLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-10 bg-gray-100">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kiddo-purple"></div>
    </div>
  );
};
