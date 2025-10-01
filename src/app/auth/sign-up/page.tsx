'use client';

import { signUp } from '@/lib/actions/auth-actions';
import { authClient } from '@/lib/auth-client';
import SignUpForm, { SignUpInputType } from '@/features/auth/components/forms/SignUpForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const { data: session, isPending } = authClient.useSession();

  const onSubmit = async (data: SignUpInputType) => {
    await signUp(data);
  };

  if (isPending) {
    return <p>Loading...</p>;
  }
  if(session){
    redirect('/dashboard')
  }

  return (
    <>
      <h1>Sign up</h1>
      <SignUpForm onSubmit={onSubmit} />
      <p>Already have an account? <Link className='underline' href="/auth/sign-in">Sign in</Link></p>
    </>
  );
}
