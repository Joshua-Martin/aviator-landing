import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { Code, Upload } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface IconPosition extends Position {
  element: React.ReactNode;
}

/**
 * Custom hook to measure container dimensions
 */
function useContainerDimensions(ref: React.RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateDimensions = () => {
      if (ref.current) {
        const { width } = ref.current.getBoundingClientRect();
        // Maintain aspect ratio of 2:1 (width:height)
        const height = width / 2;
        setDimensions({ width, height });
      }
    };

    // Initial measurement
    updateDimensions();

    // Set up ResizeObserver for responsive updates
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return dimensions;
}

/**
 * Generates an L-shaped SVG path with rounded corners between two points
 */
const generateLPath = (start: Position, end: Position, cornerRadius: number = 10): string => {
  // Calculate the middle Y-position for the horizontal segment
  const midY = start.y + (end.y - start.y) * 0.5;

  if (cornerRadius <= 0) {
    // Simple straight lines with no rounded corners
    return [
      `M ${start.x} ${start.y}`, // Move to start
      `L ${start.x} ${midY}`, // Vertical line to middle
      `L ${end.x} ${midY}`, // Horizontal line to endpoint x
      `L ${end.x} ${end.y}`, // Vertical line to endpoint
    ].join(' ');
  }

  // Path with rounded corners using quadratic bezier curves
  return [
    `M ${start.x} ${start.y}`, // Move to start
    `L ${start.x} ${midY - cornerRadius}`, // Vertical line to corner approach
    `Q ${start.x} ${midY}, ${start.x + cornerRadius} ${midY}`, // First rounded corner
    `L ${end.x - cornerRadius} ${midY}`, // Horizontal line to second corner approach
    `Q ${end.x} ${midY}, ${end.x} ${midY + cornerRadius}`, // Second rounded corner
    `L ${end.x} ${end.y}`, // Vertical line to end
  ].join(' ');
};

/**
 * TrainStep Component - Step 2 for Aviator: Train
 * Shows Code and Upload icons connected by an L-shaped path with rounded corners.
 *
 * @returns {JSX.Element}
 */
const TrainStep: React.FC = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerDimensions(containerRef);

  // Calculate sizes based on container
  const iconSize = useMemo(() => containerWidth * 0.15, [containerWidth]); // 30% of container width
  const padding = useMemo(() => containerWidth * 0.05, [containerWidth]); // 5% padding
  const cornerRadius = 16; // Slightly larger radius for bigger icons
  const halfIcon = iconSize / 2;

  // Define icon components with fixed positions
  const iconComponents: IconPosition[] = useMemo(
    () => [
      {
        // Top left icon (Code)
        x: containerWidth * 0.15 - halfIcon, // Left-side positioned at 15% for better alignment
        y: containerHeight * 0.2, // Position at 20% from top for better vertical spacing
        element: <Code size={iconSize * 0.65} className="text-gray-200" aria-label="Code" />,
      },
      {
        // Bottom right icon (Upload)
        x: containerWidth * 0.85 - halfIcon, // Right-side positioned at 85% for better alignment
        y: containerHeight * 0.6, // Position at 60% from top for better vertical alignment
        element: <Upload size={iconSize * 0.65} className="text-gray-200" aria-label="Upload" />,
      },
    ],
    [containerWidth, containerHeight, padding, iconSize, halfIcon]
  );

  // Generate the path between the two icons
  const pathData = useMemo(() => {
    if (iconComponents.length < 2) return '';
    const [startIcon, endIcon] = iconComponents;

    // Path starts from the bottom-center of the first icon
    const startPoint = {
      x: startIcon.x + halfIcon, // Center horizontally
      y: startIcon.y + iconSize, // Bottom of top icon
    };

    // Path ends at the top-center of the second icon
    const endPoint = {
      x: endIcon.x + halfIcon, // Center horizontally
      y: endIcon.y, // Top of bottom icon
    };

    return generateLPath(startPoint, endPoint, cornerRadius);
  }, [iconComponents, iconSize, halfIcon, cornerRadius]);

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col items-center justify-center h-80 bg-gradient-to-br from-white/50 via-aviator-background to-white/50 border-b border-white/10 p-8"
    >
      <div
        className="relative w-full h-full flex justify-center items-center"
        style={{
          maxWidth: '480px',
          padding: `${padding}px`,
          aspectRatio: '2/1', // Maintain 2:1 aspect ratio
        }}
      >
        {containerWidth > 0 && containerHeight > 0 && (
          <>
            {/* SVG Path */}
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 ${containerWidth} ${containerHeight}`}
              fill="none"
              className="absolute top-0 left-0"
              style={{ zIndex: 0 }}
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d={pathData}
                stroke="#a1a1aa"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Icons */}
            {iconComponents.map((pos: IconPosition, index: number) => (
              <div
                key={index}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  zIndex: 1,
                  transform: 'translateZ(0)', // Force GPU acceleration
                }}
              >
                <div className="bg-gray-800 border-2 border-gray-600 rounded-xl h-full w-full flex items-center justify-center shadow-lg">
                  {pos.element}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TrainStep;
