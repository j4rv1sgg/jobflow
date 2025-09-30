'use server';

import { auth } from '../auth';
import { headers } from 'next/headers';

export const signUp = async (name: string, email: string, password: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      callbackURL: '/',
    },
  });
  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
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
