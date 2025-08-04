import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useWaitlist } from '../../hooks/useWaitlist';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Props for the WaitlistField component.
 * Extend in the future for callbacks, etc.
 */
export interface WaitlistFieldProps {
  /**
   * Optional callback when the form is successfully submitted.
   * @param email The submitted company email address.
   */
  onSubmit?: (email: string) => void;
}

/**
 * Form values for the waitlist field.
 */
interface WaitlistFormValues {
  email: string;
}

/**
 * Checks if an email is a company email (not a generic provider).
 * @param email The email address to check.
 * @returns True if the email is a company email, false otherwise.
 */
function isCompanyEmail(email: string): boolean {
  // List of common free email domains
  const freeDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'gmx.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'msn.com',
    'live.com',
    'me.com',
    'comcast.net',
    'ymail.com',
    'googlemail.com',
    'inbox.com',
    'rocketmail.com',
  ];

  // Get the domain from the email
  const domain = email.split('@')[1]?.toLowerCase();
  return !freeDomains.includes(domain || '');
}

/**
 * WaitlistField component renders a styled email input and button for joining a waitlist.
 * Validates for company emails and displays errors inline.
 *
 * @param {WaitlistFieldProps} props - Component props.
 * @returns {JSX.Element} The rendered waitlist field.
 */
export const WaitlistField: React.FC<WaitlistFieldProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<WaitlistFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // Hook encapsulating waitlist submission logic (loading / success / error state)
  const { submitWaitlist, loading, success } = useWaitlist();

  /**
   * Handles form submission, validates company email, and calls onSubmit if provided.
   * @param data The form values.
   */
  const onFormSubmit: SubmitHandler<WaitlistFormValues> = async data => {
    const email = data.email;

    // Validate email format
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      setError('email', { type: 'pattern', message: 'Please enter a valid email address' });
      return;
    }

    // Check if it's a company email
    if (!isCompanyEmail(email)) {
      setError('email', { type: 'pattern', message: 'Please use your company email address' });
      return;
    }

    // Clear any existing errors
    clearErrors();

    try {
      await submitWaitlist(email);

      // If there's an onSubmit callback, call it
      if (onSubmit) {
        onSubmit(email);
      }
    } catch (error) {
      setError('email', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Failed to submit email',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="w-full mx-auto"
        aria-label="Join waitlist form"
        noValidate
      >
        <div className={cn('relative w-full max-w-screen', success && 'min-w-0')}>
          <div
            className={
              `flex items-center justify-between w-full bg-white border-gray-100 rounded-lg shadow-md border focus-within:ring-2 focus-within:ring-black/70 ` +
              (errors.email ? 'border-red-500' : 'border-transparent')
            }
          >
            {!success ? (
              <>
                <label htmlFor="waitlist-email" className="sr-only">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your company email"
                  className="flex-1 px-4 py-3 bg-transparent text-sm md:text-base text-gray-900 placeholder-gray-400 focus:outline-none rounded-lg"
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address.',
                    },
                  })}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'waitlist-email-error' : undefined}
                  disabled={loading}
                />
                <div className="pr-1 py-1 relative flex items-center justify-center">
                  <button
                    type="submit"
                    className={cn(
                      "px-2 md:px-4 md:py-2 py-1 flex items-center justify-center rounded-md",
                      "bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium",
                      "hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-600",
                      "active:bg-gradient-to-r active:from-blue-800 active:to-indigo-700",
                      "transition-all duration-150 ease-in-out",
                      "shadow-md hover:shadow-lg hover:-translate-y-0.5",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    )}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5 text-white" />
                    ) : (
                      <span className="text-sm md:text-base font-medium">Join Waitlist</span>
                    )}
                  </button>
                  {/* Decorative stars centered above the button */}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-3 space-x-3 w-full">
                <Check className="w-6 h-6 text-da-green-600 bg-da-green-500/20 rounded-full p-1" />
                <span className="text-lg text-da-green-600">
                  You've been added to the waitlist!
                </span>
              </div>
            )}
          </div>
          {/* Error message below input */}
          {errors.email?.message && (
            <div className="mt-1 text-sm text-red-600">{errors.email.message}</div>
          )}
        </div>
      </form>
    </div>
  );
};

/**
 * Default export for convenience.
 */
export default WaitlistField;
