import React from 'react';
import './step-row.css';

/**
 * DeployStep Component - Step 3 for Aviator: Deploy
 * Shows a mock app skeleton and the AI avatar image to the right.
 *
 * @returns {JSX.Element}
 */
const DeployStep: React.FC = (): JSX.Element => (
  <div className="flex w-full flex-col items-center justify-center h-80 bg-gradient-to-br from-white/50 via-aviator-background to-white/50 p-8 space-y-6">
    {/* Mock App + Avatar */}
    <div className="flex items-center justify-center w-full max-w-lg mx-auto space-x-2">
      {/* Mock App Skeleton */}
      <div className="step-row-app flex flex-col rounded-xl p-6 w-64 h-52 space-y-3">
        <div className="h-4 w-1/2 bg-white/20 rounded" />
        <div className="h-3 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-2/3 bg-white/10 rounded" />
        <div className="h-3 w-1/2 bg-white/5 rounded" />
        <div className="h-3 w-5/6 bg-white/10 rounded" />
        <div className="h-3 w-1/3 bg-white/5 rounded" />
      </div>
      {/* AI Avatar */}
      <div className="flex items-center justify-center">
        <img
          src={'./js/components/da-avatar-image.png'}
          alt="AI Avatar"
          className="w-24 h-52 border-4 border-white/10 shadow-lg bg-white object-cover rounded-xl"
        />
      </div>
    </div>
  </div>
);

export default DeployStep;
