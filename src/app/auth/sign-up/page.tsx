'use client';

import { signUp } from '@/lib/actions/auth-actions';
import { authClient } from '@/lib/auth-client';
import SignUpForm, {
  SignUpInputType,
} from '@/features/auth/components/forms/SignUpForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function SignUpPage() {
  const { data: session, isPending } = authClient.useSession();

  const onSubmit = async (data: SignUpInputType) => {
    await signUp(data);
  };

  if (isPending) {
    return <p>Loading...</p>;
  }
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden md:block w-1/2 h-full bg-neutral-900"></div>

      <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center ">
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm onSubmit={onSubmit} />
          </CardContent>
          <CardDescription className="text-center">
            Already have an account?{' '}
            <Link className="underline" href="/auth/sign-in">
              Sign in
            </Link>
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
