
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
  const playerInstanceRef = useRef<Plyr | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up function to safely destroy the player instance
  const cleanupPlayer = () => {
    if (playerInstanceRef.current) {
      try {
        playerInstanceRef.current.destroy();
      } catch (err) {
        console.error("Error destroying player:", err);
      }
      playerInstanceRef.current = null;
    }
  };

  // Initialize player on mount and clean up on unmount
  useEffect(() => {
    return () => {
      cleanupPlayer();
    };
  }, []);

  // Setup the player and handle source changes
  useEffect(() => {
    if (!videoRef.current) return;
    setError(null);

    // If we don't have a player yet, create one
    if (!playerInstanceRef.current) {
      try {
        playerInstanceRef.current = new Plyr(videoRef.current, {
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

        if (playerInstanceRef.current) {
          // Progress tracking
          playerInstanceRef.current.on('timeupdate', () => {
            if (!videoRef.current || !playerInstanceRef.current) return;
            const duration = playerInstanceRef.current.duration || 1;
            const currentTime = playerInstanceRef.current.currentTime || 0;
            const progress = Math.floor((currentTime / duration) * 100);
            
            if (onProgress && progress > 0) {
              onProgress(progress);
            }
          });

          // Handle errors
          playerInstanceRef.current.on('error', (event) => {
            console.error('Plyr error:', event);
            setError('Error playing video. Please try again later.');
          });
        }
      } catch (err) {
        console.error('Error initializing Plyr:', err);
        setError('Could not initialize video player');
      }
    }
  }, [onProgress]);

  // Handle source changes without recreating the player
  useEffect(() => {
    if (!videoRef.current || !src) return;
    
    // Simply update the video source without manipulating DOM elements
    if (videoRef.current) {
      videoRef.current.src = src;
      videoRef.current.load();
      
      // If player exists, refresh it
      if (playerInstanceRef.current) {
        // Wait for the video to reload before forcing a refresh
        videoRef.current.onloadeddata = () => {
          if (playerInstanceRef.current) {
            try {
              playerInstanceRef.current.source = {
                type: 'video',
                sources: [
                  {
                    src: src,
                    type: src.endsWith('.webm') ? 'video/webm' : 
                          src.endsWith('.ogg') ? 'video/ogg' : 'video/mp4',
                  },
                ],
              };
            } catch (err) {
              console.error("Error updating Plyr source:", err);
            }
          }
        };
      }
    }
  }, [src]);

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
            onClick={() => {
              setError(null);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="video-container">
          <video
            ref={videoRef}
            playsInline
            poster={poster}
            className="w-full aspect-video"
            onError={handleVideoError}
            crossOrigin="anonymous"
            preload="metadata"
          >
            <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 
                                   src.endsWith('.ogg') ? 'video/ogg' : 'video/mp4'} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      {title && (
        <div className="p-4 bg-white">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      )}
    </div>
  );
};
