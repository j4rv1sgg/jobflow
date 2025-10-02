'use server';

import { SignUpInputType } from '@/features/auth/components/forms/SignUpForm';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { SignInInputType } from '@/features/auth/components/forms/SignInForm';

export const signUp = async (data: SignUpInputType) => {
  try {
    const result = await auth.api.signUpEmail({
      body: { ...data },
    });
    return { success: true, data: result };
  } catch (err: unknown) {
    console.error('SignUp error:', err);
    return {
      success: false,
      message: (err as Error)?.message, 
     
    };
  }
};

export const signIn = async (data: SignInInputType) => {
   try {
    const result = await auth.api.signInEmail({
      body: { ...data },
    });
    return { success: true, data: result };
  } catch (err: unknown) {
    console.error('SignIn error:', err);
    return {
      success: false,
      message: (err as Error)?.message, 
     
    };
  }
};

export const getSession = async () => {
  const result = await auth.api.getSession({
    headers: await headers(),
  });
  return result;
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};
