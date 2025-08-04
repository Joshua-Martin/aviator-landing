import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Props for the HeroVideo component
 */
interface HeroVideoProps {
  /** Video source URL */
  src: string;
  /** CSS classes to apply to the video container */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Hero video component with autoplay, loop, and unmute functionality
 * 
 * Features:
 * - Autoplay video (muted by default for browser compatibility)
 * - Loop continuously
 * - Unmute button overlay positioned over the video
 * - Responsive design with rounded corners and shadow
 * - Accessibility support with proper ARIA labels
 */
export const HeroVideo: React.FC<HeroVideoProps> = ({
  src,
  className = '',
  alt = 'Aviator AI Avatar Demo Video'
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * Toggle mute/unmute state of the video
   */
  const toggleMute = (): void => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  /**
   * Handle video load to ensure proper autoplay
   */
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video is muted for autoplay compliance
      video.muted = true;
      
      // Try to play the video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Video autoplay failed:', error);
        });
      }
    }
  }, []);

  return (
    <div className={cn("relative", className)}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full max-w-lg h-auto rounded-2xl shadow-2xl"
        aria-label={alt} 
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Unmute Button Overlay */}
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
    </div>
  );
};

HeroVideo.displayName = 'HeroVideo';
