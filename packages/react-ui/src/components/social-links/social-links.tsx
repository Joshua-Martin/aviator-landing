import { InstagramIcon } from 'lucide-react';
import XTwitterIcon from '../icons/x-icon';

export const SocialLinks = () => {
  return (
    <div className="flex gap-2">
      <a href="https://x.com/Aviator_cx" target="_blank" rel="noopener noreferrer">
        <XTwitterIcon className="w-4 h-4 md:w-6 md:h-6" />
      </a>
      <a href="https://www.instagram.com/aviator_cx" target="_blank" rel="noopener noreferrer">
        <InstagramIcon className="w-4 h-4 md:w-6 md:h-6" />
      </a>
    </div>
  );
};
