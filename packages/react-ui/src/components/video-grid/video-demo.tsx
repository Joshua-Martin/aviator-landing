import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { AviatorButton } from '../custom/aviator-button';
import { Play, Loader2, X } from 'lucide-react';
import { trackVideoEvent } from '../../lib/firebase-config';

/**
 * Video data for the demo component
 */
interface DemoVideo {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Video file path (landscape) */
  landscapeSrc: string;
  /** Video file path (portrait) */
  portraitSrc: string;
  /** Optional poster/thumbnail */
  poster?: string;
  /** Logo */
  logo: string;
}

/**
 * VideoDemo Component - A modern video demo player with toggle buttons
 *
 * Features:
 * - Two toggle buttons for different demo videos (Cursor/HubSpot)
 * - Large central video player with modern styling
 * - Native video controls for full playback management
 * - Audio enabled by default
 * - Preloading when play is initiated
 * - Clean design with theme colors
 * - Responsive design with max width of 100rem
 *
 * @param props - Component props
 * @returns JSX.Element
 */
// Video dimensions (16:9 aspect ratio)
const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;

/**
 * Custom React hook to detect if the viewport is mobile-sized.
 * Uses window.innerWidth and updates on resize.
 *
 * @param {number} breakpoint - The max width (in px) to consider as mobile. Default: 768.
 * @returns {boolean} True if current viewport is mobile-sized, false otherwise.
 */
function useIsMobile({ breakpoint = 768 }: { breakpoint?: number } = {}): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

export const VideoDemo: React.FC = () => {
  // Detect if the user is on a mobile device (viewport width <= 768px)
  const isMobile: boolean = useIsMobile({ breakpoint: 768 });

  // Available demo videos
  const videos: DemoVideo[] = useMemo(
    () => [
      {
        id: 'cursor',
        name: 'Cursor',
        logo: './assets/videos/demo-logos/cursor.png',
        landscapeSrc: './assets/videos/16-9/Cursor-Demo-Landscape-1080p-24fps.mp4',
        portraitSrc: './assets/videos/9-16/Cursor-Demo-portrait-1080p-30fps.mp4',
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        logo: './assets/videos/demo-logos/hubspot.png',
        landscapeSrc: './assets/videos/16-9/Hubspot-Demo-Landscape-1080p-30fps.mp4',
        portraitSrc: './assets/videos/9-16/Hubspot-Demo-Portrait-1080p-30fps.mp4',
      },
    ],
    []
  );

  const [selectedVideoId, setSelectedVideoId] = useState<string>('cursor');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const prevVideoId = useRef<string>(selectedVideoId);

  // Preload videos
  useEffect(() => {
    videos.forEach(video => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = video.landscapeSrc;
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    });
  }, []);

  /**
   * Get the currently selected video
   */
  /**
   * Get the currently selected video
   *
   * @returns {DemoVideo} The selected demo video object.
   */
  const getCurrentVideo = (): DemoVideo => {
    return videos.find((video: DemoVideo) => video.id === selectedVideoId) || videos[0];
  };

  /**
   * Handle video switch
   */
  const handleVideoSwitch = (videoId: string): void => {
    // Reset error state when switching videos
    setHasError(false);
    if (videoId === selectedVideoId || isLoading) return;

    setIsTransitioning(true);
    setIsLoading(true);

    // Track video switch event
    const newVideo = videos.find(v => v.id === videoId);
    const currentVideo = getCurrentVideo();
    trackVideoEvent(currentVideo.id, 'pause', {
      name: currentVideo.name,
      source: currentVideo.landscapeSrc,
      switchedTo: videoId,
      switchedToName: newVideo?.name,
    });

    // Small delay to allow the transition to start
    setTimeout(() => {
      prevVideoId.current = selectedVideoId;
      setSelectedVideoId(videoId);

      // Preload the video before showing it
      const video = videos.find(v => v.id === videoId);
      if (video) {
        const tempVideo = document.createElement('video');
        tempVideo.src = video.landscapeSrc;
        tempVideo.preload = 'metadata';
        tempVideo.onloadedmetadata = () => {
          // Small delay to ensure the transition is smooth
          setTimeout(() => {
            setIsLoading(false);
            setIsTransitioning(false);
          }, 100);
        };
        tempVideo.onerror = () => {
          setHasError(true);
          console.error('Failed to load video:', video.landscapeSrc);
          setIsLoading(false);
          setIsTransitioning(false);
        };
      }
    }, 150);
  };

  /**
   * Handle play button click
   */
  const handlePlayClick = async (): Promise<void> => {
    if (hasError) {
      // Attempt to reload if previously errored
      setHasError(false);
    }
    if (!videoRef.current) return;

    try {
      await videoRef.current.play();
      setIsPlaying(true);

      // Track video play event with analytics
      const currentVideo = getCurrentVideo();
      trackVideoEvent(currentVideo.id, 'play', {
        name: currentVideo.name,
        source: currentVideo.landscapeSrc,
        playMethod: 'button-click',
      });
    } catch (error) {
      setHasError(true);
      console.error('Error playing video:', error);
    }
  };

  /**
   * Handle video ended
   */
  const handleVideoEnded = (): void => {
    setIsPlaying(false);

    // Track video complete event with analytics
    const currentVideo = getCurrentVideo();
    trackVideoEvent(currentVideo.id, 'complete', {
      name: currentVideo.name,
      source: currentVideo.landscapeSrc,
      watchDuration: videoRef.current?.currentTime || 0,
    });
  };

  /**
   * Handle video error
   */
  const handleVideoError = (): void => {
    setHasError(true);
    console.error('Video failed to load:', getCurrentVideo().landscapeSrc);
  };

  /**
   * Handle video play state change
   */
  const handleVideoPlay = (): void => {
    setIsPlaying(true);

    // Track video play event from native controls
    const currentVideo = getCurrentVideo();
    trackVideoEvent(currentVideo.id, 'play', {
      name: currentVideo.name,
      source: currentVideo.landscapeSrc,
      playMethod: 'native-controls',
    });
  };

  /**
   * Handle video pause state change
   */
  const handleVideoPause = (): void => {
    setIsPlaying(false);

    // Track video pause event
    const currentVideo = getCurrentVideo();
    trackVideoEvent(currentVideo.id, 'pause', {
      name: currentVideo.name,
      source: currentVideo.landscapeSrc,
      pausePosition: videoRef.current?.currentTime || 0,
    });
  };

  const currentVideo = getCurrentVideo();

  return (
    <div
      className={cn(
        'w-full max-w-[80rem] mx-auto p-2 md:p-4 flex flex-col items-center justify-center'
      )}
    >
      <div className="flex items-center justify-center gap-4 md:hidden pb-4">
        {videos.map(video => (
          <AviatorButton
            key={video.id}
            onClick={() => handleVideoSwitch(video.id)}
            className={`p-1 sm:p-1.5 md:p-2 transition-all duration-300 ${
              selectedVideoId === video.id ? 'bg-white' : 'bg-black/80 hover:bg-black/70'
            }`}
            disabled={isLoading || isTransitioning}
            type="button"
          >
            <img
              src={video.logo}
              alt={video.name}
              className={`h-6 w-auto transition-opacity duration-300 ${
                selectedVideoId === video.id ? 'opacity-100' : 'opacity-70'
              }`}
            />
          </AviatorButton>
        ))}
      </div>
      {/* Video Player Container */}
      <div className="relative w-full">
        {/* Main video container */}
        <div className="relative bg-white rounded-xl md:rounded-3xl p-0 md:p-3">
          {/* Video Buttons */}
          <div className="absolute top-4 left-0 right-0 justify-center gap-4 z-20 hidden md:flex">
            {videos.map(video => (
              <AviatorButton
                key={video.id}
                onClick={() => handleVideoSwitch(video.id)}
                className={`p-1 sm:p-1.5 md:p-2 transition-all duration-300 ${
                  selectedVideoId === video.id ? 'bg-white' : 'bg-black/80 hover:bg-black/70'
                }`}
                disabled={isLoading || isTransitioning}
                type="button"
              >
                <img
                  src={video.logo}
                  alt={video.name}
                  className={`h-6 w-auto transition-opacity duration-300 ${
                    selectedVideoId === video.id ? 'opacity-100' : 'opacity-70'
                  }`}
                />
              </AviatorButton>
            ))}
          </div>

          {/* Main video container with fixed aspect ratio */}
          {/*
            Main video container: Adjusts aspect ratio and max dimensions for portrait on mobile.
            Uses 9:16 for portrait, 16:9 for landscape.
          */}
          <div
            ref={videoContainerRef}
            className={cn(
              'relative rounded-2xl overflow-hidden bg-black',
              isMobile
                ? 'max-h-[70vh] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)]'
                : 'max-h-[50vh] w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)] md:w-full md:min-h-[55vh] md:max-h-[55vh] lg:min-h-[60vh] lg:max-h-[60vh]'
            )}
            style={{
              aspectRatio: isMobile ? '9/16' : `${VIDEO_WIDTH}/${VIDEO_HEIGHT}`,
            }}
          >
            {/* Loading overlay */}
            {(isLoading || isTransitioning) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 transition-opacity duration-300">
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              </div>
            )}

            {/* Video Element - Always visible with controls */}
            <div
              className={`relative w-full h-full transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/*
                Video element: Uses portrait video on mobile, landscape otherwise.
                Adjusts container aspect ratio for portrait videos on mobile.
              */}
              <video
                ref={videoRef}
                key={currentVideo.id + (isMobile ? '-portrait' : '-landscape')}
                src={isMobile ? currentVideo.portraitSrc : currentVideo.landscapeSrc}
                className="w-full h-full object-contain"
                preload="metadata"
                playsInline
                controls
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                autoPlay={false}
                onCanPlay={() => {
                  // Reset error state on successful load
                  setHasError(false);
                  // Video is ready to play, we can remove the loading state
                  setIsLoading(false);
                  setIsTransitioning(false);
                }}
              />

              {/* Preview/Overlay State - Show when not playing */}
              {!isPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Background overlay */}
                  <div className="absolute inset-0 bg-black/40"></div>
                  {/* Blur overlay */}
                  <div className="absolute inset-0 backdrop-blur-sm"></div>
                  {/* Play button */}
                  <AviatorButton
                    onClick={handlePlayClick}
                    rounded="rounded-full"
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 z-10 hover:scale-105 transition-transform duration-200"
                    disabled={isLoading || isTransitioning}
                  >
                    {isLoading ? (
                      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-white animate-spin" />
                    ) : hasError ? (
                      <X className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-red-500" />
                    ) : (
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-white" />
                    )}
                  </AviatorButton>
                  {/* Play button text */}
                  {!isLoading && (
                    <div className="relative z-10 mt-2 md:mt-4 text-white font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap">
                      {hasError
                        ? `Error loading ${currentVideo.name} Demo`
                        : `Play ${currentVideo.name} Demo`}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VideoDemo.displayName = 'VideoDemo';
