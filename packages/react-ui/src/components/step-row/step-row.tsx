import React from 'react';
import CaptureStep from './capture-step';
import TrainStep from './train-step';
import DeployStep from './deploy-step';

/**
 * Props for individual step items
 */
interface StepItem {
  /** Unique identifier for the step */
  id: string;
  /** Step number (1, 2, 3) */
  stepNumber: number;
  /** Step title - value-focused headline */
  title: string;
  /** Step description - benefit-focused explanation */
  description: string;
  /** React node to render as the main visual content for the step */
  content: React.ReactNode;
}

/**
 * Aviator step data focusing on value and business outcomes
 * Uses React nodes for content instead of imageSrc
 */
const aviatorSteps: StepItem[] = [
  {
    id: '1',
    stepNumber: 1,
    title: 'Capture',
    description:
      'Aviator records your app in action. Just enter your URL and interact—Aviator captures every click, form, and workflow, ready for AI training.',
    content: <CaptureStep />,
  },
  {
    id: '2',
    stepNumber: 2,
    title: 'Train',
    description:
      'Aviator’s AI learns from your captured demo. Add code snippets, upload docs, and fine-tune how your AI Avatar explains and interacts with your app.',
    content: <TrainStep />,
  },
  {
    id: '3',
    stepNumber: 3,
    title: 'Deploy',
    description:
      'Launch your AI-powered demo. Aviator’s Avatar gives live, interactive product tours—answering questions, guiding users, and driving conversions 24/7.',
    content: <DeployStep />,
  },
];

/**
 * StepRow Component - A clean, elegant component showcasing the 3-step process for Aviator
 *
 * @returns {JSX.Element}
 */
export const AviatorStepRow: React.FC = () => {
  /**
   * Renders an individual step card
   * @param {StepItem} step - The step data
   * @returns {JSX.Element}
   */
  const renderStep = (step: StepItem): JSX.Element => (
    <div
      key={step.id}
      className="flex flex-col bg-gradient-to-br from-[#fff3e8] to-white backdrop-blur-sm border border-black/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="p-4 md:p-6 block md:hidden">
        {/* Title with inline step number - mobile only */}
        <div className="flex items-center">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
            {step.stepNumber}
          </div>
          <h3 className="ml-3 text-lg font-semibold text-gray-900 leading-tight">{step.title}</h3>
        </div>
      </div>
      {/* Content Container - fills top 3/4 of each card, can be any React node */}
      <div className="h-[20rem] flex items-center justify-center bg-transparent border-t border-b border-black/10 md:border-none">
        {step.content}
      </div>
      {/* Content with padding */}
      <div className="p-4 md:p-6 space-y-0 md:space-y-3">
        {/* Title with inline step number */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
            {step.stepNumber}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{step.title}</h3>
        </div>
        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[80rem]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-gray-700 text-sm font-medium">
            Just three steps to your AI demo.
          </span>
        </div>
        <h2 className="text-4xl font-normal text-gray-900">How Aviator Works</h2>
      </div>
      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {aviatorSteps.map((step: StepItem) => renderStep(step))}
      </div>
    </div>
  );
};

AviatorStepRow.displayName = 'AviatorStepRow';
