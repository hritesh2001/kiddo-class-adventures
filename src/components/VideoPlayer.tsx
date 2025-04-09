
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to determine video type from source URL
  const getVideoType = (url: string): string => {
    if (url.includes('.mp4')) return 'video/mp4';
    if (url.includes('.webm')) return 'video/webm';
    if (url.includes('.ogg')) return 'video/ogg';
    // Default to mp4 if unknown
    return 'video/mp4';
  };

  // Clean up function for the player
  const destroyPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.error('Error destroying player:', err);
      }
      playerRef.current = null;
    }
  };

  // Create player instance only once on mount
  useEffect(() => {
    return () => {
      destroyPlayer();
    };
  }, []);

  // Initialize player when video element is ready
  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

    try {
      const player = new Plyr(videoRef.current, {
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

      playerRef.current = player;

      // Handle player events
      player.on('ready', () => {
        setIsLoading(false);
        console.log('Plyr is ready');
      });

      player.on('error', (event) => {
        console.error('Plyr error:', event);
        setError('Error playing video. Please try again later.');
      });

      // Progress tracking
      player.on('timeupdate', () => {
        if (!onProgress || !player.duration) return;
        
        const progress = Math.floor((player.currentTime / player.duration) * 100);
        if (progress > 0) {
          onProgress(progress);
        }
      });

      // Setup one-time error handler for the video element
      const videoErrorHandler = () => {
        setError('Unable to load video. Please check your connection and try again.');
        setIsLoading(false);
      };
      
      videoRef.current.addEventListener('error', videoErrorHandler, { once: true });
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('error', videoErrorHandler);
        }
      };
    } catch (err) {
      console.error('Error initializing Plyr:', err);
      setError('Could not initialize video player');
      setIsLoading(false);
    }
  }, [onProgress]);

  // Handle src changes without destroying the player
  useEffect(() => {
    if (!videoRef.current || !src) return;
    
    setIsLoading(true);
    setError(null);
    
    // Update video source directly
    if (videoRef.current) {
      // Create or update source element
      const sourceElement = videoRef.current.querySelector('source') || document.createElement('source');
      sourceElement.setAttribute('src', src);
      sourceElement.setAttribute('type', getVideoType(src));
      
      // Ensure source is in the video element
      if (!videoRef.current.contains(sourceElement)) {
        videoRef.current.appendChild(sourceElement);
      }
      
      // Reset video element
      videoRef.current.load();
      
      // If player exists, we need to reset it
      if (playerRef.current) {
        videoRef.current.onloadeddata = () => {
          setIsLoading(false);
          
          // This timeout ensures DOM operations complete before Plyr manipulates anything
          setTimeout(() => {
            if (playerRef.current) {
              try {
                playerRef.current.play().catch(() => {
                  // Auto-play was prevented, this is normal
                  console.log('Autoplay prevented by browser');
                });
              } catch (e) {
                console.error('Error playing video after source change:', e);
              }
            }
          }, 0);
        };
      }
    }
  }, [src]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    if (videoRef.current) {
      videoRef.current.load();
      
      // Give the browser a moment to begin loading before we start playing
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.play().catch(err => {
            console.error('Error on retry:', err);
            setError('Failed to play video after retry.');
          });
        }
      }, 100);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      {error ? (
        <div className="bg-red-100 p-4 text-red-800 rounded-lg">
          <p>{error}</p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleRetry}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="video-container">
          {isLoading && (
            <div className="flex items-center justify-center p-10 bg-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kiddo-purple"></div>
            </div>
          )}
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
      
      {title && (
        <div className="p-4 bg-white">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      )}
    </div>
  );
};
