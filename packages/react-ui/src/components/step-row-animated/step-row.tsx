import React from 'react';
import StepOne from './steps/step-one';
import StepTwo from './steps/step-two';
import StepThree from './steps/step-three';

/**
 * Represents a single step in the StepRow process.
 */
interface StepItem {
  /** Unique identifier for the step */
  id: string;
  /** Step number (1, 2, 3) */
  stepNumber: number;
  /** Step title - concise headline for the step */
  title: string;
  /** Step description - clear explanation of the step's value */
  description: string;
  /** React node to render as the main visual content for the step */
  content: React.ReactNode;
}

/**
 * Default step data for the StepRow component.
 * Each step describes a key part of the product workflow.
 */
const defaultSteps: StepItem[] = [
  {
    id: '1',
    stepNumber: 1,
    title: 'Capture',
    description:
      'With our browser extension, effortlessly capture a frontend copy of your product screens. Speak naturally as you demo your product—our AI learns from your narration and seamlessly stitches everything together.',
    content: <StepOne />,
  },
  {
    id: '2',
    stepNumber: 2,
    title: 'Edit',
    description:
      'Easily edit captured product screens using our advanced HTML editor. Update images, content, or files, and set guardrails to control what the AI can interact with.',
    content: <StepTwo />,
  },
  {
    id: '3',
    stepNumber: 3,
    title: 'Deploy',
    description:
      'Embed interactive demos across your website, sales emails, GTM campaigns, or even at conferences. Our AI agent can perform demos for you 24/7, engaging prospects when their interest is highest.',
    content: <StepThree />,
  },
];

/**
 * Color themes for each step in the StepRow component.
 * All steps now use a solid 500 background, no content border, and white text for number, title, and description.
 */
const stepColorThemes = {
  /** Step 1: Pink theme */
  1: {
    background: 'bg-da-green-500',
    border: 'border-da-green-200',
    numberBg: 'bg-da-green-100/20',
    numberText: 'text-white',
    titleText: 'text-white',
    descriptionText: 'text-white',
    contentBg: 'bg-da-green-500',
    contentBorder: 'border-none',
    hover: 'hover:bg-da-green-500',
  },
  /** Step 2: Green theme (updated to match Step 1 pattern) */
  2: {
    background: 'bg-da-pink-500',
    border: 'border-da-pink-200',
    numberBg: 'bg-da-pink-100/20',
    numberText: 'text-white',
    titleText: 'text-white',
    descriptionText: 'text-white',
    contentBg: 'bg-da-pink-500',
    contentBorder: 'border-none',
    hover: 'hover:bg-da-pink-500',
  },
  /** Step 3: Yellow theme (updated to match Step 1 pattern) */
  3: {
    background: 'bg-da-yellow-500',
    border: 'border-da-yellow-200',
    numberBg: 'bg-da-yellow-100/20',
    numberText: 'text-white',
    titleText: 'text-white',
    descriptionText: 'text-white',
    contentBg: 'bg-da-yellow-500',
    contentBorder: 'border-none',
    hover: 'hover:bg-da-yellow-500',
  },
};

/**
 * StepRow Component
 *
 * Displays a three-step process in a two-column layout.
 * Each row represents a step, with the left column for step info and the right for visual content.
 * Responsive and visually distinct for each step.
 *
 * @returns {JSX.Element} The rendered StepRow component.
 */
export const StepRow: React.FC = () => {
  /**
   * Renders an individual step as a two-column row with the appropriate color theme.
   * @param {StepItem} step - The step data
   * @param {boolean} isLast - Whether this is the last step (for border control)
   * @returns {JSX.Element}
   */
  const renderStepRow = (step: StepItem): JSX.Element => {
    const theme = stepColorThemes[step.stepNumber as keyof typeof stepColorThemes];

    return (
      <div
        key={step.id}
        className={`flex flex-col lg:flex-row ${theme.background} ${theme.border} h-screen w-screen items-center justify-center p-4 md:p-6 lg:p-10 relative`}
      >
        <div className="w-full h-full flex max-w-[100rem] items-center justify-center">
          {/* Left: Step Info */}
          <div
            className={`flex flex-col justify-center space-y-4 w-full pb-4 lg:p-10 max-w-[30vw]`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${theme.numberBg} ${theme.numberText} text-lg font-bold shadow-md`}
              >
                {step.stepNumber}
              </div>
              <h3 className={`text-2xl lg:text-3xl font-bold ${theme.titleText} leading-tight`}>
                {step.title}
              </h3>
            </div>
            <p
              className={`${theme.descriptionText} text-base lg:text-lg leading-relaxed font-medium`}
            >
              {step.description}
            </p>
          </div>
          {/* Right: Step Content */}
          <div className={`flex items-center justify-center w-full md:p-6 lg:p-12 relative`}>
            {/* Digital shadow backdrop */}
            <div
              className="absolute inset-0 z-0 rounded-3xl"
              style={{
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)', // consistent dark shadow
                borderRadius: '1.5rem',
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 w-full">{step.content}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 md:mb-12 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-white text-sm font-semibold uppercase tracking-wide">
            Easy as one, two, three.
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">How it works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get started in minutes with our simple three-step process to automate your social media
          presence
        </p>
      </div>

      {/* Steps: 3 rows, 2 columns each */}
      <div className="flex flex-col">
        {defaultSteps.map((step: StepItem) => renderStepRow(step))}
      </div>
    </div>
  );
};

StepRow.displayName = 'StepRow';
