
import React from 'react';

type VideoTitleProps = {
  title: string;
};

export const VideoTitle: React.FC<VideoTitleProps> = ({ title }) => {
  return (
    <div className="p-4 bg-white">
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
};
