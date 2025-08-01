import { cn } from '../../lib/utils';

type AviatorLogoProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color1?: string;
  color2?: string;
  className?: string;
};

/**
 * Renders the Aviator logo as an SVG component.
 * @param {string} [color1='#525252'] - The fill color for the first path of the logo.
 * @param {string} [color2='#525252'] - The fill color for the second path of the logo.
 * @param {string} [className] - Additional classes to apply to the SVG element.
 * @param {React.SVGProps<SVGSVGElement>} [props] - Other SVG props.
 * @returns {JSX.Element} The AviatorLogo component.
 */
export const AviatorLogo = ({
  size = 24,
  color1 = '#525252',
  color2 = '#525252',
  className,
  ...props
}: AviatorLogoProps): JSX.Element => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100.00004 84.214882"
      version="1.1"
      id="svg1"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-auto', className)}
      {...props}
    >
      <defs id="defs1" />
      <g id="layer1" transform="translate(2e-5,-0.39255999)">
        <path
          style={{ strokeWidth: 1.97003 }}
          d="m 34.81086,0.39256 v 0.001 c -3.83387,-2.5e-4 -5.82148,0.0138 -8.86509,0.0177 H 1.4e-5 v 1.3265 2.66931 16.21127 H 55.55035 c 11.86931,0.19287 12.63674,0.48348 14.99878,1.71641 3.81842,1.99313 7.16341,5.90663 8.28989,9.69987 0.64406,2.16879 0.81851,5.71647 0.84904,17.25068 0.0211,7.98635 -0.0955,14.6555 -0.25959,14.8196 -0.1639,0.16391 -7.86615,0.2815 -17.11527,0.26062 -9.24916,-0.0209 -18.08995,0.19582 -19.64511,0.48153 -7.55426,1.38812 -13.44531,7.06718 -15.10262,14.26171 -0.16643,0.72249 -0.30467,1.45475 -0.38279,2.20507 -0.0173,0.16706 -0.031,0.31998 -0.0417,0.47035 v 0.55484 2.06356 h 8.81622 64.04282 v -2.65099 l -0.0158,-2.64283 -0.12726,-22.0324 C 99.69818,29.5817 99.69798,29.58094 97.96138,25.03051 95.71041,19.13245 92.85588,14.76031 88.51193,10.55603 84.30049,6.47997 79.77354,3.72146 74.16368,1.81412 71.08413,0.76682 70.18657,0.49485 55.80334,0.42247 54.31,0.41447 51.69641,0.41447 49.89261,0.41067 45.54579,0.40067 41.31145,0.39297 34.81035,0.39297 Z"
          id="path5"
          fill={color1}
        />
        <path
          style={{ strokeWidth: 1.97003 }}
          d="m 42.76785,37.54082 c -0.105,0.004 -0.21183,0.01 -0.31457,0.0138 -6.56898,0.30906 -8.65541,0.998 -13.77713,3.047 C 12.655973,47.01069 0.929582,62.91479 0.01732,79.47036 L -2e-5,79.78596 v 4.78478 0.0367 H 20.214173 V 81.8516 c 1.9e-5,-0.0343 0.002,-0.0575 0.002,-0.0926 0,-9.22339 7.229307,-18.94584 16.940177,-22.7827 1.56125,-0.61688 2.65768,-0.9244 5.43735,-1.11884 H 72.88352 V 37.54087 h -0.008 z"
          id="path4"
          fill={color2}
        />
      </g>
    </svg>
  );
};
