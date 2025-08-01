import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Image,
  Settings2,
  EllipsisVertical,
  Puzzle,
} from 'lucide-react';
import StepThreeContent from './step-three-content';

/**
 * StepThree component for the third step in the flow.
 * Renders a browser mockup with StepThreeContent as the web app content.
 */
export const StepThree: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      {/* Browser Window Container */}
      <div className="bg-white rounded-xl shadow-2xl border-none overflow-hidden">
        {/* Chrome-style Header: Row 1 - Window Controls & Tab */}
        <div className="bg-da-yellow-200 px-4 p-2.5 relative">
          <div className="flex items-center justify-between">
            {/* macOS-style window controls */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            {/* Centered Tab (OG icon + page name) */}
            <div className="flex-1 flex justify-center absolute left-[11rem] -translate-x-1/2 bottom-0">
              <div className="flex items-center bg-da-yellow-400 rounded-t-lg p-1 px-2 shadow-sm min-w-[180px] max-w-xs">
                <Image className="w-3 h-3 text-white mr-1" />
                <span className="text-xs text-white font-medium truncate">Your Web App</span>
              </div>
            </div>
            {/* Empty right side for symmetry */}
            <div className="w-12" />
          </div>
        </div>
        {/* Chrome-style Header: Row 2 - Navigation & Address Bar */}
        <div className="bg-da-yellow-400 p-2.5 relative">
          <div className="flex items-center space-x-2">
            {/* Navigation Controls */}
            <div className="flex items-center space-x-1">
              <ChevronLeft className="w-4 h-4 text-white" />
              <ChevronRight className="w-4 h-4 text-white" />
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </div>
            {/* Address Bar */}
            <div className="flex-1 flex items-center mx-2">
              <div className="flex items-center bg-da-yellow-500 rounded-full p-1 px-2 justify-between shadow-inner flex-1 min-w-0">
                <div className="flex items-center">
                  <div className="p-1 rounded-full bg-da-yellow-400 mr-2">
                    <Settings2 className="w-3 h-3 text-white" />{' '}
                  </div>
                  <span className="text-sm text-white font-medium truncate select-none">
                    your-web-app.com
                  </span>
                </div>
                <Star className="w-4 h-4 text-white ml-2" />
              </div>
            </div>
            {/* Extensions and more (ellipsis) icon */}
            <div className="relative">
              <Puzzle className="w-4 h-4 text-white mr-2" />
            </div>
            <EllipsisVertical className="w-4 h-4 text-white" />
          </div>
          {/* Extensions Dropdown (static, not animated) */}
          {/* You can add a static dropdown here if needed, but leaving out for now */}
        </div>
        {/* Browser Content Area - Mock Web App */}
        <div className="flex flex-row space-x-2 p-2 relative min-h-[12rem]">
          <StepThreeContent />
          {/* Floating Avatar - matches StepTwo floating style */}
          <div
            className="absolute bottom-6 right-6 w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-end z-40"
            aria-label="Floating AI avatar image."
          >
            <img
              src="./js/components/da-avatar-image.png"
              alt="Step Three Avatar"
              className="w-full h-full object-cover rounded-full mb-2"
            />
          </div>
        </div>
      </div>
      {/* No animated cursor */}
    </div>
  );
};

export default StepThree;
