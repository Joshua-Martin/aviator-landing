import React from 'react';

/**
 * Props for the AviatorLogoIcon component.
 * Extends standard SVG props for flexibility.
 */
export interface AviatorLogoIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Icon size in pixels. Defaults to 24.
   */
  size?: number;
  /**
   * Icon color. Defaults to 'currentColor'.
   */
  color?: string;
  /**
   * Accessible label for the icon. If not provided, aria-hidden will be true.
   */
  'aria-label'?: string;
  /**
   * Additional CSS classes to apply to the SVG element.
   */
  className?: string;
}

/**
 * AviatorLogoIcon - Renders the Aviator logomark as an SVG icon.
 *
 * @param {AviatorLogoIconProps} props - Props for the icon component.
 * @returns {JSX.Element} The rendered SVG Aviator logo.
 *
 * @example
 * <AviatorLogoIcon />
 * <AviatorLogoIcon size={32} color="#000" aria-label="Aviator Logo" />
 */
export const AviatorLogoIcon = ({
  size = 24,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
  ...rest
}: AviatorLogoIconProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 26.458333 26.458333"
    version="1.1"
    className={className}
    aria-label={ariaLabel}
    aria-hidden={ariaLabel ? undefined : true}
    focusable="false"
    {...rest}
  >
    <defs id="defs1" />
    <path
      d="m 13.227616,1.3642578 c -0.0042,4.04e-5 -0.0083,3.68e-4 -0.0124,5.168e-4 -0.01677,6.014e-4 -0.03346,0.00175 -0.05013,0.0031 -0.01199,3.83e-4 -0.0237,0.00252 -0.03566,0.0031 -0.604906,0.029542 -1.170647,0.3139287 -1.549259,0.7906495 -0.425616,0.3901816 -1.224399,1.824278 -5.5412641,9.3079589 -1.2643176,2.191809 -3.0124781,5.217463 -3.8845174,6.723104 -0.847767,1.463741 -1.41980251,2.52185 -1.74666345,3.335197 -0.2163075,0.538237 -0.32446576,0.969827 -0.32659505,1.332218 0.00794,0.172663 0.03485673,0.343871 0.08009847,0.510564 0.27443025,1.012603 1.18198183,1.71675 2.22105303,1.723409 l 0.021187,-0.0031 c 0.4813071,-0.0035 0.9496803,-0.158259 1.3399699,-0.442867 0.00211,-0.0016 0.0041,-0.0035 0.0062,-0.0052 0.1384309,-0.102084 0.2632536,-0.218753 0.3741374,-0.346232 0.6561745,-0.669876 1.3963075,-1.776511 2.3481771,-3.431315 3.4563726,-6.00884 4.5088621,-7.863276 5.0741091,-8.515242 0.296652,-0.342162 0.461181,-0.35954 0.763778,-0.459404 0.255675,-0.08438 0.58436,-0.11701 0.919324,-0.10697 5.3e-4,-1.6e-5 0.001,1.6e-5 0.0015,0 5e-4,1.6e-5 0.001,-1.6e-5 0.0015,0 0.334964,-0.01004 0.663648,0.02259 0.919324,0.10697 0.302594,0.09986 0.467127,0.117242 0.763778,0.459404 0.565247,0.651966 1.617736,2.506402 5.074108,8.515242 0.951869,1.654804 1.692002,2.761439 2.348177,3.431315 0.110884,0.127479 0.235708,0.244148 0.374138,0.346232 0.0021,0.0017 0.0041,0.0036 0.0062,0.0052 0.39029,0.284608 0.858662,0.439367 1.33997,0.442867 l 0.02119,0.0031 c 1.039072,-0.0067 1.946624,-0.710806 2.221053,-1.723409 0.04524,-0.166693 0.0722,-0.337901 0.0801,-0.510564 -0.0021,-0.362391 -0.110287,-0.793981 -0.326595,-1.332218 C 25.726847,20.714538 25.15481,19.656429 24.307043,18.192688 23.435004,16.687047 21.686844,13.661393 20.422526,11.469584 16.105661,3.9859032 15.306878,2.5518068 14.881262,2.1616252 14.50265,1.6849044 13.936908,1.4005179 13.332003,1.3709757 c -0.01196,-5.839e-4 -0.02367,-0.00272 -0.03566,-0.0031 -0.01666,-0.00135 -0.03336,-0.0025 -0.05013,-0.0031 -0.0041,-1.485e-4 -0.0082,-4.764e-4 -0.0124,-5.168e-4 h -5.17e-4 c -6.63e-4,3e-6 -5.42e-4,-2e-6 -10e-4,0 -6.48e-4,-2e-6 -0.0011,3e-6 -0.0015,0 -8.65e-4,2e-6 -0.0017,-7.3e-6 -0.0026,0 z"
      style={{
        fillOpacity: 0.831373,
        stroke: '#ffffff',
        strokeWidth: 0.162388,
        strokeOpacity: 0
      }}
      fill={color}
      id="path2"
    />
  </svg>
);

AviatorLogoIcon.displayName = 'AviatorLogoIcon';

export default AviatorLogoIcon;
