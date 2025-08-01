import React, { useEffect, useRef } from 'react';

interface HeroBackgroundProps {
  className?: string;
  animationSpeed?: number;
  gradientIntensity?: number;
}

/**
 * Animated wave background component that follows the hero_wave.svg pattern
 * Uses complex mathematical transformations to animate gradients along wave paths
 */
export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  className = '',
  animationSpeed = 1,
  gradientIntensity = 1,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016 * animationSpeed; // 60fps base

      if (svgRef.current) {
        updateGradientAnimations(svgRef.current, timeRef.current, gradientIntensity);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationSpeed, gradientIntensity]);

  return (
    <div className={`hero-background ${className}`}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 6635 3825"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Animated radial gradients for each wave layer */}
          {Array.from({ length: 8 }, (_, i) => (
            <radialGradient
              key={`paint${i}_radial`}
              id={`paint${i}_radial_animated`}
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFE88E" className="animate-gradient-stop-1" />
              <stop offset="35%" stopColor="#FB9CE5" className="animate-gradient-stop-2" />
              <stop offset="72%" stopColor="#096FFF" className="animate-gradient-stop-3" />
              <stop offset="100%" stopColor="#011C42" stopOpacity="0" />
            </radialGradient>
          ))}

          {/* Linear gradients for stroke animations */}
          {Array.from({ length: 9 }, (_, i) => (
            <linearGradient
              key={`paint${i + 9}_linear`}
              id={`paint${i + 9}_linear_animated`}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#011C42" />
              <stop offset="34%" stopColor="#096FFF" className="animate-linear-stop" />
              <stop offset="100%" stopColor="#096FFF" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        <g clipPath="url(#clip0_27413_564)">
          {/* Wave layer paths with animated gradients */}
          <path
            d="M6136.63 1839.58C5083.05 1625.73 4409.33 1775.4 3948.58 1976.32C3506.05 2169.27 3031.24 2571.83 2602.85 2437.03C2463.5 2391.5 2312 2298 2168 2060.5C2118 1982 2081.5 1907 2053 1794.5C2006.5 1629.5 1983 1447.5 1980 1416.5L2084 1418.5C2087 1502.5 2091.5 1652.5 2140 1884C2159.48 1941.65 2186 1997.5 2223 2060C2359.22 2290.1 2478.5 2357.5 2595.39 2404.14C3036.19 2560.33 3513.59 2091.29 3949 1834.29C4400.08 1568.04 5124.73 1341.78 6306 1555.5V1886.5L6218 1861L6136.63 1839.58Z"
            fill="url(#paint0_radial_animated)"
            className="wave-layer-1"
          />

          <path
            d="M6305.5 1886C6238.92 1868.36 6205.92 1854.77 6141.5 1840.5C5578.85 1715.92 5086.02 1711.05 4688 1768.5C4383.8 1812.41 4136.01 1894.6 3948.58 1976.33C3506.05 2169.28 3031.39 2571.3 2603 2436.5C2400.5 2372.78 2250.53 2219.83 2122 1980C2035.5 1827 1986 1460.5 1979.5 1419H1884.5C1924.5 1603.5 1966 1879.5 2086 2045C2273.5 2321 2421.5 2418.17 2610.31 2469.91C3025.99 2583.82 3498.95 2247.49 3948.16 2118.36C4270.77 2032.59 4740.42 1954.65 5320 2012.5C5521.5 2037.5 5736.5 2068.5 5961 2122C6074.5 2155.5 6187.03 2198.97 6305.5 2241.5V1886Z"
            fill="url(#paint1_radial_animated)"
            className="wave-layer-2"
          />

          <path
            d="M5968.77 2123.26C5042.86 1909.28 4419.08 1982.95 3948.15 2118.35C3498.95 2247.48 3025.99 2583.83 2610.31 2469.9C2553.78 2454.41 2432.5 2411 2321.5 2319C2253.1 2264.61 2186 2181.5 2134 2111C2011.56 1945 1989.5 1907 1885 1417L1808 1413L1823.5 1694C1843 1752 1924 1986 2148.5 2223C2267.55 2357.27 2363 2427 2489.5 2469C2533.18 2483.5 2573 2493 2617.5 2502C3020.23 2595.56 3492.22 2326.11 3947.73 2260.4C4198.97 2224.16 4602.5 2198 5041.5 2254.5C5455.73 2313.79 5880 2409 6307 2568.5V2242.5C6307 2242.5 6196.14 2200.49 6124.5 2175.5C6037.5 2145.16 5968.77 2123.26 5968.77 2123.26Z"
            fill="url(#paint2_radial_animated)"
            className="wave-layer-3"
          />

          <path
            d="M5825 2412.5C5031.5 2194.5 4429.2 2190.93 3947.71 2260.38C3492.2 2326.09 3020.73 2595.56 2618 2502C2408.5 2457.5 2308 2404.5 2122.5 2193.5C2053 2119.5 1911 1947.5 1821.5 1682.5V1961C1828.06 1983.81 1876 2075 1955 2167.5C2011.81 2234.02 2062.5 2277.5 2122 2322.5C2157.5 2349.35 2256.5 2411 2378 2467C2452.5 2500.5 2539.6 2521.19 2625.23 2535.68C3014.8 2609.45 3485.71 2398.39 3947.31 2402.41C4218.4 2404.76 4720.5 2444.69 5209 2568.5C5607.5 2669.5 6032.5 2821.5 6306 2961.5V2567.5C6306 2567.5 6146.16 2509 6042 2476.5C5946 2446.55 5825 2412.5 5825 2412.5Z"
            fill="url(#paint3_radial_animated)"
            className="wave-layer-4"
          />

          <path
            d="M6307.5 2961.5C6154.5 2882.5 5894 2779.5 5654 2697C5447 2628 5231.5 2571 5019.5 2524C4588 2425 4184 2403.5 3947.29 2402.43C3485.7 2398.42 3014.79 2609.48 2625.21 2535.7C2579.3 2527.01 2492.57 2512.36 2397 2475C2296.5 2429 2171.27 2365.29 2079.5 2289.5C1956 2187.5 1860 2053 1823.5 1965.5L1824.5 2196C1839.5 2234 1922.5 2316.34 2114 2413C2295.83 2504.78 2521.5 2559.5 2632.67 2568.59C3008.95 2623.19 3479.14 2484.88 3946.87 2544.46C4188.5 2571 4662 2678 5077 2827C5351.72 2925.63 5628 3040.5 5863 3146.5C6036.94 3226.68 6194.5 3297.5 6306.5 3357L6307.5 2961.5Z"
            fill="url(#paint4_radial_animated)"
            className="wave-layer-5"
          />

          <path
            d="M6306.29 3354.5C6143.5 3271 5891.5 3157.5 5615.79 3037.65C5368.5 2927 5090.5 2828.5 4834.79 2745.65C4477.79 2626.15 4146.65 2569.51 3947.17 2544.1C3479.46 2484.52 3009.5 2620.5 2633 2567.5C2509 2552.5 2299.51 2508.53 2112 2411.5C1868.5 2285.5 1841 2220.5 1823 2195L1822 2386C1845.03 2392.19 2008.5 2471.5 2158 2519.5C2283 2562.5 2396.89 2575.38 2428 2579.5C2489.3 2588.03 2561.09 2593.61 2640.5 2601.5C3003.44 2637.56 3472.7 2564.62 3946.75 2686.13C4060.54 2715.29 4219.5 2763.5 4400.5 2832.5C4663 2937 4926.5 3063.5 5252 3234.5C5396.78 3310.56 5569 3414 5721.5 3514C5952.5 3674 5998.5 3720.5 6139.5 3827.5C6198.63 3872.37 6306.29 3918.65 6306.29 3918.65V3354.5Z"
            fill="url(#paint5_radial_animated)"
            className="wave-layer-6"
          />

          <path
            d="M5297.34 3257.98C4883 3041.5 4459.97 2818.1 3946.43 2686.49C3472.38 2565 3003.05 2637.52 2640.11 2601.46C2559 2590.5 2372.5 2584.5 2211 2536C2030 2482.5 1859 2398.5 1822 2386L1825 2626.5C1878.65 2627.66 2117.32 2622.56 2331 2624C2462.09 2624.88 2583.77 2631.03 2647.57 2634.35C2997.2 2652.49 3465.3 2645.39 3946.01 2828.52C4204.5 2928 4404 3031 4725 3246C4885.79 3353.7 5045.5 3482.5 5169.5 3597.5C5268 3688.85 5334.5 3766.5 5379 3828L6138.5 3826.5C6138.5 3826.5 5898 3633 5727 3517.5C5556 3402 5297.34 3257.98 5297.34 3257.98Z"
            fill="url(#paint6_radial_animated)"
            className="wave-layer-7"
          />

          <path
            d="M5377 3825.32C5151 3510.5 4473.5 3018 3946.01 2828.52C3465.3 2645.4 2997.19 2652.49 2647.56 2634.35C2581.51 2630.92 2453.5 2624 2317 2623.5C2107 2623 1877.44 2626.2 1825 2626.5V2733C1899.1 2723.21 2040.01 2713.08 2218 2696C2306.19 2686.43 2402.01 2674.97 2506 2670C2603.06 2665.36 2707.5 2665.69 2812.5 2671C2961.08 2678.51 3115.83 2699.09 3268.5 2732.5C3506.41 2784.56 3740.28 2866.58 3945.5 2969.5C4479 3238 4801.84 3610.59 4961.64 3825.32H5377Z"
            fill="url(#paint7_radial_animated)"
            className="wave-layer-8"
          />
        </g>

        <defs>
          <clipPath id="clip0_27413_564">
            <rect width="6635" height="3825" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <style>{`
        .hero-background {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .wave-layer-1 { animation: waveFloat1 8s ease-in-out infinite; }
        .wave-layer-2 { animation: waveFloat2 10s ease-in-out infinite; }
        .wave-layer-3 { animation: waveFloat3 12s ease-in-out infinite; }
        .wave-layer-4 { animation: waveFloat4 14s ease-in-out infinite; }
        .wave-layer-5 { animation: waveFloat5 16s ease-in-out infinite; }
        .wave-layer-6 { animation: waveFloat6 18s ease-in-out infinite; }
        .wave-layer-7 { animation: waveFloat7 20s ease-in-out infinite; }
        .wave-layer-8 { animation: waveFloat8 22s ease-in-out infinite; }
        
        .animate-gradient-stop-1 { animation: gradientShift1 6s ease-in-out infinite; }
        .animate-gradient-stop-2 { animation: gradientShift2 8s ease-in-out infinite; }
        .animate-gradient-stop-3 { animation: gradientShift3 10s ease-in-out infinite; }
        .animate-linear-stop { animation: linearShift 4s ease-in-out infinite; }
        
        @keyframes waveFloat1 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-5px) translateX(2px); }
          50% { transform: translateY(-3px) translateX(-1px); }
          75% { transform: translateY(-7px) translateX(1px); }
        }
        
        @keyframes waveFloat2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-4px) translateX(-2px); }
          66% { transform: translateY(-6px) translateX(1px); }
        }
        
        @keyframes waveFloat3 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          40% { transform: translateY(-3px) translateX(3px); }
          80% { transform: translateY(-5px) translateX(-2px); }
        }
        
        @keyframes waveFloat4 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          30% { transform: translateY(-6px) translateX(-1px); }
          70% { transform: translateY(-2px) translateX(2px); }
        }
        
        @keyframes waveFloat5 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          20% { transform: translateY(-4px) translateX(1px); }
          60% { transform: translateY(-7px) translateX(-3px); }
        }
        
        @keyframes waveFloat6 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          35% { transform: translateY(-5px) translateX(-2px); }
          75% { transform: translateY(-3px) translateX(3px); }
        }
        
        @keyframes waveFloat7 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          45% { transform: translateY(-6px) translateX(2px); }
          85% { transform: translateY(-4px) translateX(-1px); }
        }
        
        @keyframes waveFloat8 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-3px) translateX(-3px); }
          75% { transform: translateY(-8px) translateX(1px); }
        }
        
        @keyframes gradientShift1 {
          0%, 100% { stop-color: #FFE88E; }
          33% { stop-color: #FFB88E; }
          66% { stop-color: #FFC88E; }
        }
        
        @keyframes gradientShift2 {
          0%, 100% { stop-color: #FB9CE5; }
          50% { stop-color: #FB7CE5; }
        }
        
        @keyframes gradientShift3 {
          0%, 100% { stop-color: #096FFF; }
          50% { stop-color: #0A5FFF; }
        }
        
        @keyframes linearShift {
          0%, 100% { stop-color: #096FFF; }
          50% { stop-color: #0A7FFF; }
        }
      `}</style>
    </div>
  );
};

/**
 * Updates gradient animations using complex mathematical transformations
 * Calculates wave propagation and applies gradient position shifts
 */
function updateGradientAnimations(svg: SVGSVGElement, time: number, intensity: number): void {
  const gradients = svg.querySelectorAll('radialGradient[id*="animated"]');

  gradients.forEach((gradient, index) => {
    const radialGradient = gradient as SVGRadialGradientElement;

    // Calculate wave-based position using sine and cosine functions
    const waveOffset = index * 0.5; // Phase offset for each layer
    const frequency = 0.3 + index * 0.1; // Different frequencies per layer

    // Complex wave mathematics for natural movement
    const primaryWave = Math.sin(time * frequency + waveOffset) * intensity;
    const secondaryWave = Math.cos(time * frequency * 1.3 + waveOffset * 1.7) * intensity * 0.6;
    const tertiaryWave = Math.sin(time * frequency * 0.7 + waveOffset * 2.1) * intensity * 0.3;

    // Combine waves for complex motion
    const combinedWaveX = primaryWave + secondaryWave * 0.5;
    const combinedWaveY = secondaryWave + tertiaryWave;

    // Calculate gradient center positions based on wave layer
    const basePositions = [
      { cx: 6138, cy: 942 }, // Layer 1
      { cx: 5895, cy: 1170 }, // Layer 2
      { cx: 5705, cy: 1454 }, // Layer 3
      { cx: 5508, cy: 1775 }, // Layer 4
      { cx: 5351, cy: 1931 }, // Layer 5
      { cx: 5158, cy: 2123 }, // Layer 6
      { cx: 4924, cy: 2315 }, // Layer 7
      { cx: 4403, cy: 2782 }, // Layer 8
    ];

    const basePos = basePositions[index] || basePositions[0];

    // Apply wave transformations to gradient position
    const newCx = basePos.cx + combinedWaveX * 50;
    const newCy = basePos.cy + combinedWaveY * 30;

    // Calculate rotation based on wave movement
    const rotation = primaryWave * 15 + index * 45 + time * 10;

    // Apply transform to gradient
    const transform = `translate(${newCx} ${newCy}) rotate(${rotation}) scale(1100 910)`;
    radialGradient.setAttribute('gradientTransform', transform);

    // Animate gradient stops for color shifting
    const stops = radialGradient.querySelectorAll('stop');
    stops.forEach((stop, stopIndex) => {
      const stopElement = stop as SVGStopElement;
      const offsetShift = Math.sin(time * 0.5 + stopIndex + index) * 0.05;
      const currentOffset = parseFloat(stopElement.getAttribute('offset') || '0');
      const newOffset = Math.max(0, Math.min(1, currentOffset + offsetShift));
      stopElement.setAttribute('offset', `${newOffset * 100}%`);
    });
  });

  // Update linear gradients for stroke animations
  const linearGradients = svg.querySelectorAll('linearGradient[id*="animated"]');
  linearGradients.forEach((gradient, index) => {
    const linearGradient = gradient as SVGLinearGradientElement;
    const waveShift = Math.sin(time * 0.4 + index * 0.8) * 100;

    // Update gradient positions for flowing effect
    linearGradient.setAttribute('x1', `${4270 + waveShift}`);
    linearGradient.setAttribute('y1', `${1965 + waveShift * 0.3}`);
    linearGradient.setAttribute('x2', `${4270 - waveShift * 0.5}`);
    linearGradient.setAttribute('y2', `${2647 + waveShift * 0.7}`);
  });
}

export default HeroBackground;
