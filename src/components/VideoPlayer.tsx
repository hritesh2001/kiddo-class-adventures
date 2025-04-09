
import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Cleanup any existing player instance
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    try {
      // Create new Plyr instance
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          'play-large', 'play', 'progress', 'current-time', 'mute',
          'volume', 'captions', 'settings', 'pip', 'fullscreen'
        ],
        settings: ['captions', 'quality', 'speed'],
        resetOnEnd: true,
        invertTime: false,
        toggleInvert: true,
        keyboard: { focused: true, global: true },
        tooltips: { controls: true, seek: true },
        captions: { active: true, language: 'auto', update: true }
      });

      // Event listeners
      if (playerRef.current) {
        // Progress tracking
        playerRef.current.on('timeupdate', () => {
          if (!videoRef.current || !playerRef.current) return;
          const duration = playerRef.current.duration || 1;
          const currentTime = playerRef.current.currentTime || 0;
          const progress = Math.floor((currentTime / duration) * 100);
          
          if (onProgress && progress > 0) {
            onProgress(progress);
          }
        });

        // Handle errors
        playerRef.current.on('error', (event) => {
          console.error('Plyr error:', event);
          setError('Error playing video. Please try again later.');
        });
      }
    } catch (err) {
      console.error('Error initializing Plyr:', err);
      setError('Could not initialize video player');
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src, onProgress]);

  const handleVideoError = () => {
    setError('Unable to load video. Please check your connection and try again.');
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      {error ? (
        <div className="bg-red-100 p-4 text-red-800 rounded-lg">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          playsInline
          poster={poster}
          className="w-full aspect-video"
          onError={handleVideoError}
          crossOrigin="anonymous"
        >
          <source src={src} type="video/mp4" />
          {/* Support for additional video formats */}
          {src.endsWith('.webm') && <source src={src} type="video/webm" />}
          {src.endsWith('.ogg') && <source src={src} type="video/ogg" />}
          Your browser does not support the video tag.
        </video>
      )}
      
      {title && (
        <div className="p-4 bg-white">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      )}
    </div>
  );
};
