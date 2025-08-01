import React from 'react';

/**
 * Props for the ExtensionIcon component.
 * Extends standard SVG props for flexibility.
 */
/**
 * Props for the XTwitterIcon component.
 * Extends standard SVG props for flexibility.
 */
export interface XTwitterIconProps extends React.SVGProps<SVGSVGElement> {
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
 * ExtensionIcon - Renders a LinkedIn-style globe ("globe-americas") SVG icon.
 *
 * @param {ExtensionIconProps} props - Props for the icon component.
 * @returns {JSX.Element} The rendered SVG globe icon.
 *
 * @example
 * <ExtensionIcon />
 * <ExtensionIcon size={24} color="#0073b1" aria-label="Public" />
 */
/**
 * XTwitterIcon - Renders the official X (Twitter) logo as an SVG icon.
 *
 * @param {XTwitterIconProps} props - Props for the icon component.
 * @returns {JSX.Element} The rendered SVG X (Twitter) logo.
 *
 * @example
 * <XTwitterIcon />
 * <XTwitterIcon size={32} color="#000" aria-label="X Logo" />
 */
export const XTwitterIcon = ({
  size = 24,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
  ...rest
}: XTwitterIconProps): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 300 300.251"
    fill="none"
    stroke="none"
    className={className}
    aria-label={ariaLabel}
    aria-hidden={ariaLabel ? undefined : true}
    focusable="false"
    {...rest}
  >
    <path
      d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
      fill={color}
    />
  </svg>
);

XTwitterIcon.displayName = 'XTwitterIcon';

export default XTwitterIcon;
