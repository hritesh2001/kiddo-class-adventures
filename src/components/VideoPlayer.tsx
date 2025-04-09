
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Clean up function to safely destroy the player instance
  const cleanupPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.error("Error destroying player:", err);
      }
      playerRef.current = null;
    }
  };

  // Initialize player only once when component mounts
  useEffect(() => {
    return () => {
      cleanupPlayer();
    };
  }, []);

  // Handle source changes without recreating the entire player
  useEffect(() => {
    if (!videoRef.current) return;
    setError(null);

    // If player exists, update source instead of recreating
    if (playerRef.current) {
      try {
        // Update source by directly setting the video element's src
        if (videoRef.current) {
          const mediaElement = videoRef.current;
          const sourceElements = mediaElement.querySelectorAll('source');
          
          // Remove existing sources
          sourceElements.forEach(source => {
            source.remove();
          });
          
          // Create new source element
          const newSource = document.createElement('source');
          newSource.src = src;
          newSource.type = src.endsWith('.webm') 
            ? 'video/webm' 
            : src.endsWith('.ogg')
              ? 'video/ogg'
              : 'video/mp4';
          
          // Append new source
          mediaElement.appendChild(newSource);
          
          // Load the new source
          mediaElement.load();
          playerRef.current.source = {
            type: 'video',
            sources: [
              {
                src: src,
                type: 'video/mp4',
              },
            ],
          };
        }
      } catch (err) {
        console.error("Error updating source:", err);
        setError('Error updating video source');
      }
    } else {
      // Initialize player if it doesn't exist
      try {
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

        if (playerRef.current) {
          setIsInitialized(true);
          
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
    }
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
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
          >
            Reload
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
            <source src={src} type="video/mp4" />
            {src.endsWith('.webm') && <source src={src} type="video/webm" />}
            {src.endsWith('.ogg') && <source src={src} type="video/ogg" />}
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
