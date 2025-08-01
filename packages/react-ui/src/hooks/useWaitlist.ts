import { useState } from 'react';
import { addToWaitlist } from '../lib/waitlist-service';

/**
 * Custom React hook that provides a helper for submitting an email address to the
 * Firebase wait-list function. In addition to the submit helper it also returns
 * status flags that make it trivial for UI elements to reflect the current
 * request state (loading / success / error).
 *
 * Usage:
 * ```tsx
 * const { submitWaitlist, loading, success, error } = useWaitlist();
 *
 * const handleClick = () => submitWaitlist(email);
 * ```
 */
export interface UseWaitlist {
  /**
   * Initiates a request to add the provided e-mail to the wait-list.
   */
  submitWaitlist: (email: string) => Promise<void>;
  /** While `true`, a submission is currently in-flight. */
  loading: boolean;
  /** Indicates that the most recent submission completed successfully. */
  success: boolean;
  /** Holds the most recent error (if any) thrown by the submission call. */
  error: Error | null;
}

export function useWaitlist(): UseWaitlist {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Adds the supplied e-mail to the wait-list Cloud Function.
   *
   * @param email – A **valid** e-mail address that _should_ belong to a company
   *                domain. Validation should be performed by the caller so we
   *                can fail early and avoid an unnecessary network request.
   * @throws An `Error` whenever the Firebase callable function throws or when
   *         input validation fails upstream.
   */
  const submitWaitlist = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addToWaitlist(email);
      if (!response.success) {
        // Normalise a non-successful response into a rejected promise so that
        // caller error handling remains consistent.
        throw new Error(response.message);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to submit email'));
      throw err; // Re-throw so callers can handle it with try/catch.
    } finally {
      setLoading(false);
    }
  };

  return {
    submitWaitlist,
    loading,
    success,
    error,
  };
}
