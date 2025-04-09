
import React, { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { toast } from 'sonner';

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

  // Create player instance
  useEffect(() => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    // Clean up any existing player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    try {
      // Create new player instance
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
        setIsLoading(false);
      });

      // Progress tracking
      player.on('timeupdate', () => {
        if (!onProgress || !player.duration) return;
        
        const progress = Math.floor((player.currentTime / player.duration) * 100);
        if (progress > 0) {
          onProgress(progress);
        }
      });
      
      // Force the video to load
      if (videoRef.current) {
        videoRef.current.load();
      }
    } catch (err) {
      console.error('Error initializing Plyr:', err);
      setError('Could not initialize video player');
      setIsLoading(false);
    }
    
    // Cleanup function
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (err) {
          console.error('Error destroying player:', err);
        }
      }
    };
  }, [src, onProgress]); // Recreate player when source changes

  // Handle source changes
  useEffect(() => {
    if (!videoRef.current || !playerRef.current) return;
    
    const handleMetadataLoaded = () => {
      setIsLoading(false);
    };
    
    videoRef.current.addEventListener('loadedmetadata', handleMetadataLoaded, { once: true });
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
      }
    };
  }, [src]);

  // Handle retrying playback after error
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    // Re-initialize the player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    // Force a small delay before attempting to reinitialize
    setTimeout(() => {
      if (!videoRef.current) return;
      
      try {
        const player = new Plyr(videoRef.current, {
          controls: [
            'play-large', 'play', 'progress', 'current-time', 'mute',
            'volume', 'captions', 'settings', 'pip', 'fullscreen'
          ]
        });
        
        playerRef.current = player;
        videoRef.current.load();
        
        player.on('ready', () => {
          setIsLoading(false);
          // Fix for TypeScript error by handling the potential void return type
          const playPromise = player.play();
          // Only call catch if it's actually a Promise
          if (playPromise instanceof Promise) {
            playPromise.catch(err => {
              console.error('Error on retry play:', err);
            });
          }
        });
      } catch (err) {
        console.error('Error on retry:', err);
        setError('Failed to play video after retry.');
        setIsLoading(false);
      }
    }, 300);
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
