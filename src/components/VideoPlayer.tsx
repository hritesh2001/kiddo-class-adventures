
import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

type VideoPlayerProps = {
  src: string;
  poster?: string;
  title?: string;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
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
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        playsInline
        poster={poster}
        className="w-full aspect-video"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {title && (
        <div className="p-4 bg-white">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
      )}
    </div>
  );
};
