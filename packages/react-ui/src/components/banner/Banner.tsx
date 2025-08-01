import { useState, type FC } from 'react';
import { X } from 'lucide-react';

/**
 * BannerProps defines the props accepted by the Banner component.
 * Currently, it does not accept any props, but this interface is defined for future extensibility.
 */
export interface BannerProps {}

/**
 * Banner component displays an announcement banner at the top of the page.
 * - Shows a waitlist announcement with a call-to-action button.
 * - Includes a close (X) button to dismiss the banner.
 * - Uses TailwindCSS for styling.
 *
 * @returns JSX.Element | null
 */
export const Banner: FC<BannerProps> = function Banner({}: BannerProps): JSX.Element | null {
  // State to control banner visibility
  const [visible, setVisible] = useState<boolean>(false);

  // Hide the banner when the X button is clicked
  const handleClose = (): void => setVisible(false);

  if (!visible) return null;

  return (
    <div className="w-full h-12 bg-gradient-to-r from-aviator-black/80 via-aviator-black to-aviator-black/80 flex items-center justify-center text-sm font-semibold text-white shadow-lg relative overflow-hidden group z-50">
      <div className="flex items-center space-x-3 px-4">
        <div className="flex items-center space-x-2">
          <span className="whitespace-nowrap">🚀 Aviator's waitlist is open!</span>
        </div>
      </div>
      {/* Close (X) Icon */}
      <button
        type="button"
        aria-label="Close banner"
        onClick={handleClose}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white hover:text-gray-200 focus:outline-none"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
};

// Export default for easier import
export default Banner;
