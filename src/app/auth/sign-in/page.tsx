'use client';

import SignInForm, {
  SignInInputType,
} from '@/features/auth/components/forms/SignInForm';
import { signIn } from '@/lib/actions/auth-actions';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  const { data: session, isPending } = authClient.useSession();

  const onSubmit = async (data: SignInInputType) => {
    await signIn(data);
  };

  if (isPending) {
    return <p>Loading...</p>;
  }
  if (session) {
    redirect('/dashboard');
  }

  return (
    <>
      <h1>Sign in</h1>
      <SignInForm onSubmit={onSubmit} />
      <p>
        Already have an account? <Link className='underline' href="/auth/sign-up">Sign up</Link>
      </p>
    </>
  );
}
