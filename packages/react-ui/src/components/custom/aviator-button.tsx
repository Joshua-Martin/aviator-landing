/**
 * AviatorButton component renders a button with a 3D effect using custom CSS classes.
 *
 * @remarks
 * This button is styled to have a 3D appearance using the 'aviator-button' CSS class and supports all standard button props.
 *
 * @param props - React button props, children to display inside the button, and an optional rounded prop for border radius.
 * @returns A styled button element with a 3D effect.
 */
import React from 'react';
import { cn } from '../../lib/utils';
import './aviator-button.css';

export interface AviatorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The content to display inside the button.
   */
  children: React.ReactNode;
  /**
   * Custom rounded class (e.g., 'rounded-md', 'rounded-lg', 'rounded-full').
   * Defaults to 'rounded-md' if not provided.
   */
  rounded?: string;
  /**
   * If true, renders the button as an anchor (<a>) element. Requires 'href'.
   */
  asLink?: boolean;
  /**
   * The href for the anchor element (only used if asLink is true).
   */
  href?: string;
}

/**
 * Renders a 3D-styled button using the "aviator" design.
 *
 * If the `asLink` prop is true, renders an anchor (<a>) element with button styles and the provided href.
 * Otherwise, renders a <button> element.
 *
 * @param props - Props for the button, including children, rounded, asLink, href, and standard button attributes.
 * @returns The AviatorButton component.
 */
export const AviatorButton = ({
  children,
  className = '',
  rounded = 'rounded-md',
  asLink = false,
  href,
  ...props
}: AviatorButtonProps) => {
  if (asLink) {
    return (
      <a
        href={href}
        className={cn('aviator-button', rounded, className)}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={props.type ?? 'button'}
      className={cn('aviator-button', rounded, className)}
      {...props}
    >
      {children}
    </button>
  );
};
