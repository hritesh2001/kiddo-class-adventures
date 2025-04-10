import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Plyr from 'plyr';
import Hls from 'hls.js';
import 'plyr/dist/plyr.css';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Static HLS playlist URL
const HLS_PLAYLIST_URL = 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8';

const VideoPlayerPage = () => {
  const { classId, subjectId, chapterId } = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initialize Plyr player
    playerRef.current = new Plyr(video, {
      captions: { active: true, update: true, language: 'en' },
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
    });

    // Check if Hls.js is supported
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true, // Optional: Improves performance, disable if issues persist
        xhrSetup: (xhr) => {
          xhr.withCredentials = false; // Ensure no credentials are sent
        },
      });

      hls.loadSource(HLS_PLAYLIST_URL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log('HLS media attached successfully');
        setLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', event, data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error: Could not load HLS stream. Check your connection or the URL.');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error: Video format may not be supported.');
              break;
            default:
              setError('An unknown error occurred with HLS playback.');
              break;
          }
          setLoading(false);
        }
      });

      // Cleanup HLS instance
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback to native HLS playback (e.g., Edge on Windows supports this)
      video.src = HLS_PLAYLIST_URL;
      video.addEventListener('loadedmetadata', () => {
        console.log('Native HLS playback started');
        setLoading(false);
      });
      video.addEventListener('error', () => {
        setError('Error loading video natively.');
        setLoading(false);
      });
    } else {
      // Neither Hls.js nor native HLS is supported
      setError('HLS playback is not supported in this browser.');
      setLoading(false);
    }

    // Cleanup Plyr instance
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <AppLayout>
      <div className="kiddo-container py-8">
        <Link to={`/classes/${classId}/subjects/${subjectId}`}>
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft size={18} />
            <span>Back to Chapters</span>
          </Button>
        </Link>

        {loading && (
          <div className="text-center py-4">Loading video...</div>
        )}

        {error && (
          <div className="text-center py-4 text-red-500">{error}</div>
        )}

        <div className="max-w-6xl mx-auto">
          <video
            ref={videoRef}
            className="plyr-react plyr"
            playsInline
            controls
            style={{ display: !loading && !error ? 'block' : 'none' }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default VideoPlayerPage;