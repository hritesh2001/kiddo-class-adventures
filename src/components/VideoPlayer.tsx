
import React from 'react';
import 'plyr/dist/plyr.css';
import { useVideoPlayer } from '@/hooks/use-video-player';
import { getVideoType } from '@/utils/video-utils';
import { VideoError } from './video/VideoError';
import { VideoLoading } from './video/VideoLoading';
import { VideoTitle } from './video/VideoTitle';

type VideoPlayerProps = {
  src: string;
  poster?: string;
  title?: string;
  onProgress?: (progress: number) => void;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  poster, 
  title,
  onProgress 
}) => {
  const {
    videoRef,
    error,
    isLoading,
    handleRetry
  } = useVideoPlayer({ src, onProgress });

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      {error ? (
        <VideoError errorMessage={error} onRetry={handleRetry} />
      ) : (
        <div className="video-container">
          {isLoading && <VideoLoading />}
          <video
            ref={videoRef}
            playsInline
            poster={poster}
            className={`w-full aspect-video ${isLoading ? 'hidden' : 'block'}`}
            crossOrigin="anonymous"
            preload="metadata"
          >
            <source src={src} type={getVideoType(src)} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      {title && <VideoTitle title={title} />}
    </div>
  );
};
