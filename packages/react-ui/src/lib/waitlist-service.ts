import { httpsCallable } from 'firebase/functions';
import functions from './firebase-config';

interface AddToWaitlistResponse {
  success: boolean;
  message: string;
}

export async function addToWaitlist(email: string): Promise<AddToWaitlistResponse> {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required and must be a string');
  }

  const addToWaitlist = httpsCallable(functions, 'addToWaitlist');
  try {
    const result = await addToWaitlist({ email });
    return result.data as AddToWaitlistResponse;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to add to waitlist');
  }
}
