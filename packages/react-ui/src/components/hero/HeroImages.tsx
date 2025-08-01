import React from 'react';

/**
 * HeroImages component displays two layered images with floating labels around them.
 *
 * The images are slightly overlapped for a dynamic effect, and four labels are
 * positioned around the images at a higher z-index. The component is responsive
 * and uses inline styles for positioning.
 *
 * @returns The HeroImages component.
 */
export const HeroImages: React.FC = () => {
  // Image sources (relative to public for Vite/CRA, or use require if needed)
  const bpxStill = '/assets/bpx-still.png';
  const cpxHoldingStill = '/assets/cpx-still.png';

  // Portrait aspect ratio
  const IMG_WIDTH = 220;
  const IMG_HEIGHT = 320;

  return (
    <div
      style={{
        position: 'relative',
        width: `min(500px, 90vw)`,
        height: `${IMG_HEIGHT + 40}px`, // add some space for overlap and labels
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* First image (background) */}
      <img
        src={bpxStill}
        alt="BPX Still"
        style={{
          position: 'absolute',
          left: '0',
          top: '40px',
          width: `${IMG_WIDTH}px`,
          height: `${IMG_HEIGHT}px`,
          objectFit: 'cover',
          zIndex: 1,
          borderRadius: '18px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          background: '#f3f3f3',
        }}
      />
      {/* Second image (foreground, overlapping) */}
      <img
        src={cpxHoldingStill}
        alt="CPX Holding Still"
        style={{
          position: 'absolute',
          left: `${IMG_WIDTH * 0.6}px`, // overlap by 40%
          top: '0',
          width: `${IMG_WIDTH}px`,
          height: `${IMG_HEIGHT}px`,
          objectFit: 'cover',
          zIndex: 2,
          borderRadius: '18px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.16)',
          background: '#f3f3f3',
        }}
      />
      {/* Floating labels */}
      <div
        style={{
          position: 'absolute',
          top: '-32px',
          left: '30%',
          zIndex: 3,
          background: '#fff',
          color: '#222',
          padding: '8px 18px',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
        }}
      >
        Personalized Demos
      </div>
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '-40px',
          zIndex: 3,
          background: '#fff',
          color: '#222',
          padding: '8px 18px',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
        }}
      >
        Onboarding
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '-32px',
          left: '40%',
          zIndex: 3,
          background: '#fff',
          color: '#222',
          padding: '8px 18px',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
        }}
      >
        Customer Support
      </div>
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '-30px',
          zIndex: 3,
          background: '#fff',
          color: '#222',
          padding: '8px 18px',
          borderRadius: '999px',
          fontWeight: 600,
          fontSize: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
        }}
      >
        Upsells
      </div>
    </div>
  );
};

export default HeroImages;
