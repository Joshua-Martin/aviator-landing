import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Video resolution option
 */
interface VideoResolution {
  src: string;
  label: string;
  width: number;
  height: number;
  priority: number; // Lower number = higher priority
}

/**
 * Self-contained Hero video component with intelligent resolution detection
 * 
 * Features:
 * - Intelligent resolution selection (4K → 1080p → 720p)
 * - Device capability detection
 * - Automatic fallback on loading failures
 * - Autoplay with mute/unmute functionality
 * - No props required - completely self-contained
 */
export const HeroVideo: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [canAutoplay, setCanAutoplay] = useState<boolean>(true);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const [currentResolution, setCurrentResolution] = useState<VideoResolution | null>(null);
  const [attemptedResolutions, setAttemptedResolutions] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Available video resolutions in order of preference
  const videoResolutions: VideoResolution[] = [
    {
      src: './assets/waitlist/aviator-waitlist-video-1080p.mp4',
      label: '1080p',
      width: 1920,
      height: 1080,
      priority: 2
    },
    {
      src: './assets/waitlist/aviator-waitlist-video-720p.mp4',
      label: '720p',
      width: 1280,
      height: 720,
      priority: 1
    }
  ];

  /**
   * Toggle mute/unmute state of the video
   */
  const toggleMute = (): void => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      setUserInteracted(true);
      
      // Try to play if video was paused due to autoplay restrictions
      if (!userInteracted && videoRef.current.paused) {
        videoRef.current.play().catch(() => {
          // Ignore play failures after user interaction
        });
      }
    }
  };

  /**
   * Handle manual play button click
   */
  const handlePlay = (): void => {
    if (videoRef.current) {
      setUserInteracted(true);
      videoRef.current.play().catch((error) => {
        console.warn('Manual video play failed:', error);
        setCanAutoplay(false);
      });
    }
  };



  /**
   * Get initial resolution - always start with 1080p
   */
  const getInitialResolution = (): VideoResolution => {
    // Always start with 1080p, fallback to 720p if it fails
    return videoResolutions.find(v => v.label === '1080p')!;
  };

  /**
   * Try next lower resolution
   */
  const tryNextResolution = (): void => {
    if (!currentResolution) return;
    
    // Find next lower priority resolution that hasn't been attempted
    const nextResolution = videoResolutions
      .filter(v => v.priority < currentResolution.priority && !attemptedResolutions.has(v.src))
      .sort((a, b) => b.priority - a.priority)[0];
    
    if (nextResolution) {
      console.log(`Falling back from ${currentResolution.label} to ${nextResolution.label}`);
      setCurrentResolution(nextResolution);
      setAttemptedResolutions(prev => new Set([...prev, currentResolution.src]));
      setIsLoading(true);
      setHasError(false);
    } else {
      console.warn('All video resolutions failed to load');
      setHasError(true);
      setIsLoading(false);
    }
  };

  /**
   * Handle video loading timeout
   */
  const handleLoadTimeout = (): void => {
    console.warn(`Video loading timeout for ${currentResolution?.label}, trying next resolution`);
    tryNextResolution();
  };

  /**
   * Handle video loading events
   */
  const handleLoadStart = (): void => {
    setIsLoading(true);
    setHasError(false);
    
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    // Set 1-second timeout for this resolution
    loadTimeoutRef.current = setTimeout(handleLoadTimeout, 1000);
  };

  const handleCanPlay = (): void => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setIsLoading(false);
    console.log(`Successfully loaded ${currentResolution?.label} video`);
  };

  const handleLoadedData = (): void => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setIsLoading(false);
  };

  const handleLoadedMetadata = (): void => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setIsLoading(false);
  };

  const handleError = (): void => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    console.warn(`Video error for ${currentResolution?.label}, trying next resolution`);
    tryNextResolution();
  };

  /**
   * Initialize with 1080p resolution
   */
  useEffect(() => {
    const initial = getInitialResolution();
    setCurrentResolution(initial);
    console.log(`Starting with ${initial.label} resolution`);
  }, []);

  /**
   * Handle video setup when resolution changes
   */
  useEffect(() => {
    const video = videoRef.current;
    if (video && currentResolution) {
      // Ensure video is muted for autoplay compliance
      video.muted = true;
      
      // Add event listeners
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      // Try to play the video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Video autoplay failed:', error);
          setCanAutoplay(false);
        });
      }
      
      // Cleanup event listeners
      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      };
    }
  }, [currentResolution]);

  // Don't render until we have a resolution selected
  if (!currentResolution) {
    return (
      <div className="relative w-full max-w-lg h-auto">
        <div className="flex items-center justify-center bg-gray-100 rounded-2xl aspect-video">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl z-5">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-2xl z-5 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-700 mb-2">Video failed to load</p>
          <p className="text-sm text-gray-500">All video formats failed to load. Please check your connection.</p>
        </div>
      )}
      
      {/* Manual Play Button (shown when autoplay fails) */}
      {!canAutoplay && !userInteracted && !hasError && (
        <button
          onClick={handlePlay}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/30 hover:bg-black/50 backdrop-blur-sm",
            "text-white rounded-2xl z-5",
            "transition-all duration-200 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-white/50"
          )}
          aria-label="Play video"
          type="button"
        >
          <div className="bg-white/20 rounded-full p-6">
            <Play className="w-12 h-12 ml-1" fill="currentColor" />
          </div>
        </button>
      )}
      
      <video
        ref={videoRef}
        src={currentResolution.src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full max-w-lg h-auto rounded-2xl shadow-2xl"
        aria-label="Aviator AI Avatar Demo Video"
        preload="metadata"
        key={currentResolution.src} // Force re-render when resolution changes
      >
        <p className="text-center text-gray-600 p-8">
          Your browser does not support the video tag.
        </p>
      </video>
      

      
      {/* Unmute Button Overlay - only show when video is playing */}
      {!hasError && !isLoading && (
        <button
          onClick={toggleMute}
          className={cn(
            "absolute top-4 right-4 z-10",
            "bg-black/50 hover:bg-black/70 backdrop-blur-sm",
            "text-white p-3 rounded-full",
            "transition-all duration-200 ease-in-out",
            "hover:scale-110 active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
            "shadow-lg"
          )}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          type="button"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}
    </div>
  );
};

HeroVideo.displayName = 'HeroVideo';
