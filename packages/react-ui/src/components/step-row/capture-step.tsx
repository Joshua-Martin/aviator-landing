import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { ExtensionIcon } from '../icons/extension-icon';
import './step-row.css';
import { Globe, Mic } from 'lucide-react';

/**
 * Calculates the left positions (in px) for the icons and the corresponding SVG path endpoints.
 * Ensures the SVG paths end at the center of each icon.
 *
 * @param containerWidth - The width of the SVG/container in px
 * @param iconSize - The width/height of the icon in px
 * @param leftPercent - The percentage from the left for the left icon (0-1)
 * @param rightPercent - The percentage from the left for the right icon (0-1)
 * @returns Object with left and right icon positions (in px)
 */
const useIconPositions = (
  containerWidth: number,
  iconSize: number,
  leftPercent: number,
  rightPercent: number
) => {
  return useMemo(() => {
    const left = containerWidth * leftPercent - iconSize / 2;
    const right = containerWidth * rightPercent - iconSize / 2;
    return { left, right };
  }, [containerWidth, iconSize, leftPercent, rightPercent]);
};

/**
 * Generates a balanced SVG path from the center (top) down to the center of a target icon.
 * The path has equal vertical segments above and below the horizontal, with minimal arcs at the corners.
 *
 * @param centerX - X coordinate of the starting center point (px)
 * @param iconX - X coordinate of the icon center (px)
 * @param verticalGap - Total vertical space between URL bar and icon (px)
 * @param arcOffset - Radius of the arc at the corners (px)
 * @returns {string} SVG path `d` attribute
 */
const getBalancedPath = (
  centerX: number,
  iconX: number,
  verticalGap: number,
  arcOffset: number
): string => {
  const startY = 0;
  const midY = startY + verticalGap / 2 - arcOffset;
  const iconY = verticalGap;
  const dir = Math.sign(iconX - centerX) || 1;
  return [
    `M${centerX} ${startY}`,
    `V${midY}`,
    `Q${centerX} ${midY + arcOffset} ${centerX + dir * arcOffset} ${midY + arcOffset}`,
    `H${iconX - dir * arcOffset}`,
    `Q${iconX} ${midY + arcOffset} ${iconX} ${midY + arcOffset + arcOffset}`,
    `V${iconY}`,
  ].join(' ');
};

/**
 * Custom hook to observe and return the width of a DOM element.
 *
 * @param ref - React ref to the DOM element
 * @returns The current width of the element in pixels
 */
function useContainerWidth(ref: React.RefObject<HTMLElement>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    function updateWidth() {
      setWidth(node.offsetWidth);
    }
    updateWidth();
    // Use ResizeObserver if available
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateWidth();
      });
      observer.observe(node);
    } else {
      // Fallback: window resize
      window.addEventListener('resize', updateWidth);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener('resize', updateWidth);
      }
    };
  }, [ref]);

  return width;
}

/**
 * CaptureStep Component - Step 1 for Aviator: Capture
 * Shows a browser URL bar, a custom SVG path splitting to Extension and Mic icons.
 *
 * @returns {JSX.Element}
 */
const CaptureStep: React.FC = (): JSX.Element => {
  // Layout constants
  const iconSize = 64; // px, larger icons
  const leftPercent = 0.2; // 20% from left
  const rightPercent = 0.8; // 80% from left
  const verticalGap = 56; // px, total vertical space between URL bar and icon
  const arcOffset = 10; // px, minimal arc for rounded corner
  const iconY = verticalGap; // icon center y

  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  // Dynamically measured container width
  const containerWidth = useContainerWidth(containerRef);
  // Fallback for SSR or initial render
  const effectiveContainerWidth = containerWidth || 400;

  // Memoized icon positions
  const { left, right } = useIconPositions(
    effectiveContainerWidth,
    iconSize,
    leftPercent,
    rightPercent
  );

  return (
    <div className="flex w-full flex-col items-center justify-center h-80 bg-gradient-to-br from-white/50 via-aviator-background to-white/50 p-8">
      {/* Browser URL Bar Simulation */}
      <div className="w-full max-w-sm min-w-sm">
        <div className="step-url-bar rounded-xl p-3">
          <div className="flex items-center space-x-3">
            <Globe color="#fff" />
            <div className="flex-1 bg-white/10 rounded-md px-3 py-2 text-sm text-white/80">
              yourapp.com
            </div>
            <ExtensionIcon size={24} color="#fff" />
          </div>
        </div>
      </div>

      {/* SVG Path connecting to icons */}
      <div
        ref={containerRef}
        className="relative w-full flex justify-center items-center"
        style={{ height: iconY + iconSize / 2 + 24, maxWidth: 480 }}
      >
        {/* SVG Path connecting icons */}
        <svg
          width={effectiveContainerWidth}
          height={iconY + iconSize / 2 + 24}
          viewBox={`0 0 ${effectiveContainerWidth} ${iconY + iconSize / 2 + 24}`}
          fill="none"
          className="absolute left-1/2 -translate-x-1/2"
          style={{ zIndex: 0 }}
        >
          {/* Left Path */}
          <path
            d={getBalancedPath(
              effectiveContainerWidth / 2,
              effectiveContainerWidth * leftPercent,
              verticalGap,
              arcOffset
            )}
            stroke="#a1a1aa"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Right Path */}
          <path
            d={getBalancedPath(
              effectiveContainerWidth / 2,
              effectiveContainerWidth * rightPercent,
              verticalGap,
              arcOffset
            )}
            stroke="#a1a1aa"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>
        {/* Left icon (Extension) */}
        <div
          className="step-icon rounded-xl flex items-center justify-center"
          style={{
            position: 'absolute',
            left: left,
            top: iconY,
            zIndex: 1,
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ExtensionIcon size={iconSize * 0.7} color="#f5f5f5" aria-label="Browser Extension" />
        </div>
        {/* Right icon (Mic) */}
        <div
          className="step-icon rounded-xl flex items-center justify-center"
          style={{
            position: 'absolute',
            left: right,
            top: iconY,
            zIndex: 1,
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mic size={iconSize * 0.7} color="#f5f5f5" aria-label="Microphone" />
        </div>
      </div>
    </div>
  );
};

export default CaptureStep;
