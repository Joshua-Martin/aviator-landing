import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Image,
  Settings2,
  Blocks,
  EllipsisVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepOneContent from './step-one-content';
import ExtensionIcon from '../../../components/icons/extension-icon';

/**
 * Animation phases for the cursor movement and interactions
 */
type AnimationPhase =
  | 'moving-to-icon'
  | 'hovering-icon'
  | 'clicking-icon'
  | 'showing-dropdown'
  | 'moving-to-start'
  | 'hovering-start'
  | 'clicking-start'
  | 'hiding-dropdown'
  | 'returning-home';

/**
 * A visual-only Chrome-style browser header component for landing page steps.
 * Mimics the look of Chrome with two header rows: window controls and tab row, then navigation and address bar row.
 * Features an animated cursor that demonstrates the browser extension interaction flow.
 */
export const StepOne: React.FC = () => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('moving-to-icon');
  const [showDropdown, setShowDropdown] = useState(false);
  const [iconClicked, setIconClicked] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const animationRunning = useRef(false);

  // Refs for dynamic positioning
  const containerRef = useRef<HTMLDivElement>(null);
  const extensionsIconRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const webAppAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Manages the animation cycle timing and phase transitions
   * Runs once on mount and loops continuously
   */
  useEffect(() => {
    if (animationRunning.current) return;
    animationRunning.current = true;

    const runAnimationLoop = async () => {
      while (animationRunning.current) {
        // Phase 1: Move to Extensions icon (2s)
        setAnimationPhase('moving-to-icon');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Phase 2: Hover for a moment (0.5s)
        setAnimationPhase('hovering-icon');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Phase 3: Click animation (0.3s)
        setAnimationPhase('clicking-icon');
        setIconClicked(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Phase 4: Show dropdown (1s)
        setAnimationPhase('showing-dropdown');
        setShowDropdown(true);
        setIconClicked(false);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Phase 5: Move to Start button (1s)
        setAnimationPhase('moving-to-start');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Phase 6: Hover over Start (0.5s)
        setAnimationPhase('hovering-start');
        await new Promise(resolve => setTimeout(resolve, 500));

        // Phase 7: Click Start (0.3s)
        setAnimationPhase('clicking-start');
        setStartClicked(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        // Phase 8: Hide dropdown (1s)
        setAnimationPhase('hiding-dropdown');
        setShowDropdown(false);
        setStartClicked(false);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Phase 9: Return to starting position (1.5s)
        setAnimationPhase('returning-home');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Brief pause before next cycle
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    runAnimationLoop();

    // Cleanup function to stop animation when component unmounts
    return () => {
      animationRunning.current = false;
    };
  }, []); // Empty dependency array - runs once on mount

  /**
   * Calculates cursor position based on current animation phase
   * Uses refs to get actual element positions for responsive accuracy
   */
  const getCursorPosition = () => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: '50%', y: '300px' };

    switch (animationPhase) {
      case 'moving-to-icon':
      case 'hovering-icon':
      case 'clicking-icon': {
        const iconRect = extensionsIconRef.current?.getBoundingClientRect();
        if (iconRect) {
          return {
            x: `${iconRect.left + iconRect.width / 2 - containerRect.left}px`,
            y: `${iconRect.top + iconRect.height / 2 - containerRect.top}px`,
          };
        }
        return { x: '90%', y: '75px' }; // Fallback
      }
      case 'showing-dropdown': {
        // Stay at the extensions icon position while dropdown appears
        const iconRect = extensionsIconRef.current?.getBoundingClientRect();
        if (iconRect) {
          return {
            x: `${iconRect.left + iconRect.width / 2 - containerRect.left}px`,
            y: `${iconRect.top + iconRect.height / 2 - containerRect.top}px`,
          };
        }
        return { x: '90%', y: '75px' }; // Fallback
      }
      case 'moving-to-start':
      case 'hovering-start':
      case 'clicking-start': {
        const buttonRect = startButtonRef.current?.getBoundingClientRect();
        if (buttonRect) {
          return {
            x: `${buttonRect.left + buttonRect.width / 2 - containerRect.left}px`,
            y: `${buttonRect.top + buttonRect.height / 2 - containerRect.top}px`,
          };
        }
        return { x: '85%', y: '140px' }; // Fallback
      }
      case 'hiding-dropdown':
      case 'returning-home':
      default: {
        const webAppRect = webAppAreaRef.current?.getBoundingClientRect();
        if (webAppRect) {
          return {
            x: `${webAppRect.left + webAppRect.width / 2 - containerRect.left}px`,
            y: `${webAppRect.top + webAppRect.height / 2 - containerRect.top}px`,
          };
        }
        return { x: '50%', y: '300px' }; // Fallback
      }
    }
  };

  return (
    <div ref={containerRef} className="h-full w-full relative">
      {/* Browser Window Container */}
      <div className="bg-white rounded-xl shadow-2xl border-none overflow-hidden">
        {/* Chrome-style Header: Row 1 - Window Controls & Tab */}
        <div className="bg-da-green-200 px-4 p-2.5 relative">
          <div className="flex items-center justify-between">
            {/* macOS-style window controls */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            {/* Centered Tab (OG icon + page name) */}
            <div className="flex-1 flex justify-center absolute left-[11rem] -translate-x-1/2 bottom-0">
              <div className="flex items-center bg-da-green-400 rounded-t-lg p-1 px-2 shadow-sm min-w-[180px] max-w-xs">
                <Image className="w-3 h-3 text-white mr-1" />
                <span className="text-xs text-white font-medium truncate">Your Web App</span>
              </div>
            </div>
            {/* Empty right side for symmetry */}
            <div className="w-12" />
          </div>
        </div>
        {/* Chrome-style Header: Row 2 - Navigation & Address Bar */}
        <div className="bg-da-green-400 p-2.5 relative">
          <div className="flex items-center space-x-2">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1">
              <ChevronLeft className="w-4 h-4 text-white" />
              <ChevronRight className="w-4 h-4 text-white" />
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </div>
            {/* Address Bar */}
            <div className="flex-1 flex items-center mx-2">
              <div className="flex items-center bg-da-green-500 rounded-full p-1 px-2 justify-between shadow-inner flex-1 min-w-0">
                <div className="flex items-center">
                  <div className="p-1 rounded-full bg-da-green-400 mr-2">
                    <Settings2 className="w-3 h-3 text-white" />{' '}
                  </div>
                  <span className="text-sm text-white font-medium truncate select-none">
                    your-web-app.com
                  </span>
                </div>
                <Star className="w-4 h-4 text-white ml-2" />
              </div>
            </div>
            {/* Extensions and more (ellipsis) icon */}
            <motion.div
              ref={extensionsIconRef}
              className="relative"
              animate={{
                scale: iconClicked ? 0.8 : 1,
              }}
              transition={{ duration: 0.1 }}
            >
              <ExtensionIcon
                className="w-4 h-4 text-white fill-white stroke-white stroke-2 mr-2"
                width={20}
                height={20}
              />
            </motion.div>
            <EllipsisVertical className="w-4 h-4 text-white" />
          </div>

          {/* Extensions Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-8 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-6 min-w-[280px] z-50"
              >
                <div className="text-lg font-semibold text-black mb-4 text-center  ">
                  Create New Demo
                </div>
                <p className="text-sm text-gray-800 mb-5 text-center">Start Building Your Demo</p>
                <motion.button
                  ref={startButtonRef}
                  className="w-full bg-gradient-to-r from-da-green-400 to-da-green-300 hover:from-da-green-500 hover:to-da-green-600 text-white px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  animate={{
                    scale: startClicked ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.15, type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Blocks className="w-5 h-5" />
                  Start
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Browser Content Area - Mock Web App */}
        <div ref={webAppAreaRef}>
          <StepOneContent />
        </div>
      </div>

      {/* Animated Cursor */}
      <motion.div
        className="absolute pointer-events-none z-50"
        style={{
          left: getCursorPosition().x,
          top: getCursorPosition().y,
        }}
        animate={{
          left: getCursorPosition().x,
          top: getCursorPosition().y,
        }}
        transition={{
          duration:
            animationPhase === 'moving-to-icon'
              ? 2
              : animationPhase === 'moving-to-start'
                ? 1
                : animationPhase === 'returning-home'
                  ? 1.5
                  : 0.5,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <path d="M3 3L10.5 21L13.5 12L22.5 9L3 3Z" fill="white" stroke="black" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
};

export default StepOne;
