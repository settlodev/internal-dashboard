import { toast } from '@/hooks/use-toast';
import { PostgrestError, AuthError } from '@supabase/supabase-js';

// Define a unified error type
type AppError = AuthError | PostgrestError | null;

export const errorHandler = async (error: AppError): Promise<void> => {
  if (!error) return;

  console.error("The Errors:", error);

  switch (error?.code) {
    case 'email_not_confirmed':
      // toast.error('Your email is not confirmed. Please check your inbox.');
      break;
    case 'invalid_login_credentials':
      // toast.error('Invalid email or password.');
      break;
    case 'user_not_found':
      // toast('User not found.');
      break;
    case 'too_many_requests':
      // toast('Too many attempts. Please try again later.');
      break;
    default:
      // toast(error.message || 'An unexpected error occurred.');
  }
};