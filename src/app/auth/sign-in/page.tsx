import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import SignInForm, {
} from '@/features/auth/components/forms/sign-in-form';
import Link from 'next/link';

export default function SignUpPage() {
  return (
      <div className="flex h-screen w-screen">
        <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center ">
            <Card className="w-[350px]">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome back</CardTitle>
              </CardHeader>
              <CardContent>
                <SignInForm />
              </CardContent>
              <CardDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link className="underline" href="/auth/sign-up">
                  Sign up
                </Link>
              </CardDescription>
            </Card>
        </div>
        <div className="hidden md:block w-1/2 h-full bg-primary"></div>
      </div>
  );
}
