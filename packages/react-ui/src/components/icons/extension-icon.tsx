import React from 'react';

/**
 * Props for the ExtensionIcon component.
 * Extends standard SVG props for flexibility.
 */
export interface ExtensionIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Icon size in pixels. Defaults to 16.
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
 * ExtensionIcon - Renders a puzzle piece extension SVG icon.
 *
 * @param {ExtensionIconProps} props - Props for the icon component.
 * @returns {JSX.Element} The rendered SVG extension icon.
 *
 * @example
 * <ExtensionIcon />
 * <ExtensionIcon size={24} color="#67D55E" aria-label="Extension" />
 */
export const ExtensionIcon: React.FC<ExtensionIconProps> = ({
  size = 16,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 72 72"
    width={size}
    height={size}
    fill="none"
    className={className}
    aria-label={ariaLabel}
    aria-hidden={ariaLabel ? undefined : true}
    focusable="false"
    {...rest}
  >
    <g clipPath="url(#clip0_305_516)">
      <g clipPath="url(#clip1_305_516)">
        <path
          d="M49.0229 69.1875C54.1272 69.1875 58.265 65.0497 58.265 59.9454V50.7033H59.9454C65.0497 50.7033 69.1875 46.5655 69.1875 41.4612C69.1875 36.357 65.0497 32.2191 59.9454 32.2191H58.265V22.9771C58.265 17.8728 54.1272 13.735 49.0229 13.735H39.7809V12.0546C39.7809 6.95032 35.643 2.8125 30.5388 2.8125C25.4345 2.8125 21.2967 6.95032 21.2967 12.0546V13.735H12.0546C6.95032 13.735 2.8125 17.8728 2.8125 22.9771V32.2191H4.49288C9.59714 32.2191 13.735 36.357 13.735 41.4612C13.735 46.5655 9.59714 50.7033 4.49288 50.7033H2.8125V69.1875H21.2967V67.5071C21.2967 62.4029 25.4345 58.265 30.5388 58.265C35.643 58.265 39.7809 62.4029 39.7809 67.5071V69.1875H49.0229Z"
          stroke={color}
          strokeWidth="5.625"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_305_516">
        <rect width="72" height="72" fill="white" />
      </clipPath>
      <clipPath id="clip1_305_516">
        <rect width="72" height="72" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

ExtensionIcon.displayName = 'ExtensionIcon';

export default ExtensionIcon;
