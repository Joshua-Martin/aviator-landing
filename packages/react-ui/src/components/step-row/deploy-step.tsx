import React from 'react';

/**
 * DeployStep Component - Step 3 for Aviator: Deploy
 * Shows a mock app skeleton and the AI avatar image to the right.
 *
 * @returns {JSX.Element}
 */
const DeployStep: React.FC = (): JSX.Element => (
  <div className="flex items-center justify-center h-full">
    <img
      src={'./assets/aviator-deploy.png'}
      alt="AI Avatar"
      className="max-w-full max-h-full w-auto h-auto object-contain"
    />
  </div>
);

export default DeployStep;
