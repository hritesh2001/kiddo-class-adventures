
import { useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';

type UseVideoPlayerProps = {
  src: string;
  onProgress?: (progress: number) => void;
};

export const useVideoPlayer = ({ src, onProgress }: UseVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    videoRef,
    playerRef,
    error,
    isLoading,
    handleRetry
  };
};
