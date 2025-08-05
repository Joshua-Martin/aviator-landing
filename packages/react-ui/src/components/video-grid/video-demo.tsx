import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AviatorLogoIcon } from '../icons/aviator-logo';
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
  /** Demo category */
  category: 'dev-tools' | 'sales-software';
  /** Hero title text */
  heroTitle: string;
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
        category: 'dev-tools',
        landscapeSrc: './assets/videos/16-9/Cursor-Demo-Landscape-1080p-24fps.mp4',
        portraitSrc: './assets/videos/9-16/Cursor-Demo-portrait-1080p-30fps.mp4',
        heroTitle: 'Watch Aviator Autonomously Demo the Cursor IDE'
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        category: 'sales-software',
        landscapeSrc: './assets/videos/16-9/Hubspot-Demo-Landscape-1080p-30fps.mp4',
        portraitSrc: './assets/videos/9-16/Hubspot-Demo-Portrait-1080p-30fps.mp4',
        heroTitle: 'Experience Aviator\'s Sales Software Demo Magic'
      },
    ],
    []
  );

  const [selectedVideoId, setSelectedVideoId] = useState<string>('cursor');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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

  /**
   * Handle tab switch - reset video state
   */
  const handleTabSwitch = (videoId: string): void => {
    if (videoId === selectedVideoId) return;
    
    // Reset all video states when switching tabs
    setIsPlaying(false);
    
    // Pause current video if playing
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    
    handleVideoSwitch(videoId);
  };

  /**
   * Navigate to previous video
   */
  const handlePreviousVideo = (): void => {
    const currentIndex = videos.findIndex(video => video.id === selectedVideoId);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : videos.length - 1;
    handleTabSwitch(videos[previousIndex].id);
  };

  /**
   * Navigate to next video
   */
  const handleNextVideo = (): void => {
    const currentIndex = videos.findIndex(video => video.id === selectedVideoId);
    const nextIndex = currentIndex < videos.length - 1 ? currentIndex + 1 : 0;
    handleTabSwitch(videos[nextIndex].id);
  };

  const currentVideo = getCurrentVideo();

  return (
    <div className="w-full max-w-[80rem]">

      {/* Main Container with Video Background */}
      <div className="rounded-2xl p-2 md:p-4 bg-blue-50/70 shadow-md">
        {/* Video Container - Always visible */}
        <div className="relative">
          {/* Video Container - Always positioned */}
          <div className="relative h-full">
            <div className="relative bg-black rounded-xl overflow-hidden h-full">
              {/* Loading overlay */}
              {(isLoading || isTransitioning) && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-700/80 z-20 transition-opacity duration-300">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
              )}

              {/* Video Element */}
              <div
                ref={videoContainerRef}
                className={cn(
                  'relative h-full transition-opacity duration-300',
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                )}
              >
                <video
                  ref={videoRef}
                  key={currentVideo.id + (isMobile ? '-portrait' : '-landscape')}
                  src={isMobile ? currentVideo.portraitSrc : currentVideo.landscapeSrc}
                  className="w-full h-full object-contain"
                  preload="metadata"
                  playsInline
                  controls={isPlaying}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  autoPlay={false}
                  onCanPlay={() => {
                    setHasError(false);
                    setIsLoading(false);
                    setIsTransitioning(false);
                  }}
                />

                {/* Video Overlay - Show when not playing */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Semi-transparent overlay */}
                    <div className="absolute inset-0 bg-black/60"></div>
                    
                    {/* Title Text */}
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight text-center mb-8 px-6 z-10 max-w-[40rem]">
                      {currentVideo.heroTitle}
                    </h2>
                    
                    {/* Play button - centered in visible area */}
                    <button
                      onClick={handlePlayClick}
                      className="w-16 h-16 md:w-20 md:h-20 z-10 hover:scale-105 transition-transform duration-200 bg-white/90 hover:bg-white rounded-full flex items-center justify-center"
                      disabled={isLoading || isTransitioning}
                    >
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-gray-800 animate-spin" />
                      ) : hasError ? (
                        <X className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
                      ) : (
                        <AviatorLogoIcon 
                          size={32} 
                          className="w-8 h-8 md:w-10 md:h-10 text-black transform rotate-[90deg] ml-1" 
                        />
                      )}
                    </button>

                    {/* Bottom Navigation Controls */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-10">
                      {/* Left Side - Navigation Arrows */}
                      <div className="flex gap-3">
                        <button
                          onClick={handlePreviousVideo}
                          className="w-12 h-12 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                          disabled={isLoading || isTransitioning}
                        >
                          <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                          onClick={handleNextVideo}
                          className="w-12 h-12 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                          disabled={isLoading || isTransitioning}
                        >
                          <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Right Side - Video Indicators */}
                      <div className="flex gap-3">
                        {videos.map((video) => (
                          <div
                            key={video.id}
                            className={cn(
                              "h-2 w-16 rounded-full transition-all duration-300 shadow-sm",
                              selectedVideoId === video.id
                                ? "bg-gradient-to-r from-blue-600 to-indigo-500 shadow-blue-500/30"
                                : "bg-white/40 hover:bg-white/60"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VideoDemo.displayName = 'VideoDemo';
