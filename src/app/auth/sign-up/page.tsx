import SignUpForm, {
} from '@/features/auth/components/forms/SignUpForm';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function SignUpPage() {

  return (
    <div className="flex h-screen w-screen">
      <div className="hidden md:block w-1/2 h-full bg-primary"></div>
      <div className="md:w-1/2 w-full h-full flex flex-col items-center justify-center ">
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm />
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
