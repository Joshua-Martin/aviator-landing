import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { Loader2, Play, X } from 'lucide-react';
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
  /** Logo */
  logo: string;
  /** Demo category */
  category: 'dev-tools' | 'sales-software';
  /** Button label for tab */
  buttonLabel: string;
  /** Hero title text */
  heroTitle: string;
  /** Value propositions with icons */
  valueProps: ValueProposition[];
}

/**
 * Value proposition interface
 */
interface ValueProposition {
  /** Icon file name from assets/dev-assets/icons/line-art/ */
  icon: string;
  /** Short description text */
  text: string;
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
        buttonLabel: 'Demos for Dev Tools',
        logo: './assets/videos/demo-logos/cursor.png',
        landscapeSrc: './assets/videos/16-9/Cursor-Demo-Landscape-1080p-24fps.mp4',
        portraitSrc: './assets/videos/9-16/Cursor-Demo-portrait-1080p-30fps.mp4',
        heroTitle: 'Watch Aviator Autonomously Demo the Cursor IDE',
        valueProps: [
          { icon: 'ai_sparkle.svg', text: 'AI-powered code demonstrations in real-time' },
          { icon: 'people.svg', text: 'Interactive developer onboarding experiences' },
          { icon: 'ai_documents.svg', text: 'Contextual feature explanations and tutorials' },
          { icon: 'refresh_circle.svg', text: 'Seamless integration with development workflows' }
        ]
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        category: 'sales-software',
        buttonLabel: 'Sales Software Demos',
        logo: './assets/videos/demo-logos/hubspot.png',
        landscapeSrc: './assets/videos/16-9/Hubspot-Demo-Landscape-1080p-30fps.mp4',
        portraitSrc: './assets/videos/9-16/Hubspot-Demo-Portrait-1080p-30fps.mp4',
        heroTitle: 'Experience Aviator\'s Sales Software Demo Magic',
        valueProps: [
          { icon: 'bar_chart.svg', text: 'Personalized CRM workflow demonstrations' },
          { icon: 'money_bag.svg', text: 'Revenue-focused feature highlighting' },
          { icon: 'calendar.svg', text: '24/7 prospect engagement without scheduling' },
          { icon: 'magnifying_glass.svg', text: 'Deep-dive analytics and reporting walkthroughs' }
        ]
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

  const currentVideo = getCurrentVideo();

  return (
    <div className="w-full max-w-[90rem] space-y-3">
      {/* Tab Buttons - Outside Container */}
      <div className="flex justify-center gap-2">
        {videos.map((video: DemoVideo) => (
          <button
            key={video.id}
            onClick={() => handleTabSwitch(video.id)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
              selectedVideoId === video.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-50 text-black hover:bg-gray-100 border border-gray-100/40'
            )}
            disabled={isLoading || isTransitioning}
          >
            {video.buttonLabel}
          </button>
        ))}
      </div>

      {/* Main Container with White to Gray Gradient */}
      <div className="bg-gradient-to-br from-white/80 to-gray-50/80 rounded-2xl p-10 md:p-14">

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Hero Text and CTAs */}
          <div className="space-y-6">
            {/* Hero Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {currentVideo.heroTitle}
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePlayClick}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                disabled={isLoading || isTransitioning}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Watch Video
                  </>
                )}
              </button>
              <a
                href="#hero"
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 text-center"
              >
                Join Waitlist
              </a>
            </div>
          </div>

          {/* Right Side - Value Propositions */}
          <div className="flex items-end justify-end">
            <div className="flex flex-col items-start justify-start space-y-4">
            {currentVideo.valueProps.map((prop: ValueProposition, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 flex-shrink-0">
                  <img
                    src={`./assets/dev-assets/icons/line-art/${prop.icon}`}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-gray-700 text-sm font-medium">{prop.text}</p>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Video Container - Always visible */}
        <div className="relative mt-8 h-[60vh]">
          {/* Video Container - Always positioned */}
          <div className="relative h-full">
            <div className="relative bg-black rounded-xl overflow-hidden h-full">
              {/* Loading overlay */}
              {(isLoading || isTransitioning) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20 transition-opacity duration-300">
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
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Semi-transparent overlay */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    
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
