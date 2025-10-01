'use server';

import { SignUpInputType } from '@/features/auth/components/forms/SignUpForm';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { SignInInputType } from '@/features/auth/components/forms/SignInForm';

export const signUp = async (data: SignUpInputType) => {
  const result = await auth.api.signUpEmail({
    body: {
      ...data,
      callbackURL: '/dashboard',
    },
  });
  return result;
};

export const signIn = async (data: SignInInputType) => {
  const result = await auth.api.signInEmail({
    body: {
      ...data,
      callbackURL: '/dashboard',
    },
  });
  return result;
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
