'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
      <div className="flex h-screen w-screen">
        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center ">
            <Card className="w-[350px]">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
              </CardHeader>
              <CardContent>
                <SignInForm onSubmit={onSubmit} />
              </CardContent>
              <CardDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link className="underline" href="/auth/sign-up">
                  Sign up
                </Link>
              </CardDescription>
            </Card>
        </div>
        <div className="hidden md:block w-1/2 h-full bg-neutral-900"></div>
      </div>
  );
}
