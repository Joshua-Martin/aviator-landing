import React from 'react';
import { motion } from 'framer-motion';

const cdnurl = 'https://pub-9c0daf630a02461a9d8223bd26e867f1.r2.dev/play-logos/';

/**
 * Animation speed constant (pixels per second) for the integration row.
 *
 * Increase this value to make the animation FASTER.
 * Decrease this value to make the animation SLOWER.
 *
 * Example: 15 = moderate speed, 10 = slow, 25 = fast
 */
export const SPEED_PX_PER_SEC = 20;

const pieceIconsList = [
  {
    name: 'calendly',
    fileName: 'calendly.png',
    url: cdnurl + 'calendly.png',
  },
  {
    name: 'hubspot',
    fileName: 'hubspot.png',
    url: cdnurl + 'hubspot.png',
  },
  {
    name: 'salesforce',
    fileName: 'salesforce.png',
    url: cdnurl + 'salesforce.png',
  },
  {
    name: 'gmail',
    fileName: 'gmail.png',
    url: cdnurl + 'gmail.png',
  },
  {
    name: 'outlook',
    fileName: 'outlook.png',
    url: cdnurl + 'outlook.png',
  },
  {
    name: 'slack',
    fileName: 'slack.png',
    url: cdnurl + 'slack.png',
  },
  {
    name: 'notion',
    fileName: 'notion.png',
    url: cdnurl + 'notion.png',
  },
  {
    name: 'airtable',
    fileName: 'airtable.png',
    url: cdnurl + 'airtable.png',
  },
];

/**
 * IntegrationIcon - Represents a single integration logo icon.
 * @param name - The name of the integration (used for alt text)
 * @param url - The URL of the integration logo image
 * @param fileName - The filename of the integration logo
 */
export const IntegrationIcon: React.FC<{
  name: string;
  url: string;
  fileName: string;
}> = ({ name, url }) => (
  <div className="flex items-center justify-center bg-white rounded-lg shadow-sm p-4 mr-6 min-h-[60px] min-w-[80px] border border-gray-100">
    <img
      src={url}
      alt={`${name} integration`}
      className="max-h-8 max-w-16 object-contain"
      loading="lazy"
    />
  </div>
);

/**
 * AnimatedRow - A row of integration icons that animates horizontally in a loop using Framer Motion.
 * @param integrations - Array of integration objects
 * @param direction - 'left' or 'right' for animation direction
 * @param speedPxPerSec - Animation speed in pixels per second. Controlled by SPEED_PX_PER_SEC constant.
 */
export const AnimatedRow: React.FC<{
  integrations: { name: string; fileName: string; url: string }[];
  direction: 'left' | 'right';
  /**
   * Animation speed in pixels per second. Controlled by SPEED_PX_PER_SEC constant.
   *
   * To speed up the animation, increase SPEED_PX_PER_SEC.
   * To slow it down, decrease SPEED_PX_PER_SEC.
   */
  speedPxPerSec?: number;
}> = ({ integrations, direction, speedPxPerSec = SPEED_PX_PER_SEC }) => {
  // Triple the integrations for seamless looping to eliminate blank spots
  const rowIntegrations = [...integrations, ...integrations, ...integrations];
  const rowRef = React.useRef<HTMLDivElement>(null);
  const [rowWidth, setRowWidth] = React.useState(0);

  React.useEffect(() => {
    if (rowRef.current) {
      // Use the width of one complete set (1/3 of total width since we tripled)
      const fullWidth = rowRef.current.scrollWidth;
      setRowWidth(fullWidth / 3);
    }
  }, [integrations]);

  // Calculate duration for seamless, steady movement
  const duration = rowWidth > 0 ? rowWidth / speedPxPerSec : 120; // fallback to 2 minutes

  // For seamless infinite scroll, we need to start at a position that allows continuous movement
  // Start at -rowWidth (one set back) and animate to 0, creating seamless loop
  const startPosition = direction === 'left' ? 0 : -rowWidth;
  const endPosition = direction === 'left' ? -rowWidth : 0;

  return (
    // Set relative positioning to allow absolute overlays for gradient fade
    <div className="overflow-hidden my-6 min-h-[76px] relative max-w-screen w-screen bg-gray-50">
      {/* Left fade overlay */}
      <div
        className="absolute left-0 top-0 h-full w-20 lg:w-40 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(90deg, #f9fafb 0%, #f9fafb 40%, rgba(249,250,251,0.8) 70%, rgba(249,250,251,0) 100%)',
        }}
      />
      {/* Right fade overlay */}
      <div
        className="absolute right-0 top-0 h-full w-20 lg:w-40 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(270deg, #f9fafb 0%, #f9fafb 40%, rgba(249,250,251,0.8) 70%, rgba(249,250,251,0) 100%)',
        }}
      />
      {/* Seamless infinite scroll animation */}
      <motion.div
        ref={rowRef}
        className="flex flex-row w-fit relative"
        animate={
          rowWidth > 0
            ? {
                x: [startPosition, endPosition],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          duration,
        }}
      >
        {rowIntegrations.map((integration, idx) => (
          <IntegrationIcon
            key={`${idx}-${integration.name}`}
            name={integration.name}
            url={integration.url}
            fileName={integration.fileName}
          />
        ))}
      </motion.div>
    </div>
  );
};

/**
 * IntegrationScroll - Main component rendering the heading and animated row of integration icons.
 * Animation speed is controlled by the SPEED_PX_PER_SEC constant at the top of the file.
 */
export const IntegrationScroll: React.FC = () => {
  return (
    <div
      className="w-full flex flex-col items-center py-4 md:py-6 bg-gray-50"
      aria-label="Integrations Demo"
    >
      <div className="text-center">
        <h2 className="md:text-2xl text-xl font-bold mb-3 text-gray-900 tracking-tight text-center px-10">
          Integrates with your existing sales and marketing stack
        </h2>
      </div>
      <div className="w-full">
        {/* Integration row uses the SPEED_PX_PER_SEC constant for animation speed. Adjust SPEED_PX_PER_SEC at the top to change speed globally. */}
        <AnimatedRow
          integrations={pieceIconsList}
          direction="right"
          speedPxPerSec={SPEED_PX_PER_SEC}
        />
      </div>
    </div>
  );
};

export default IntegrationScroll;
