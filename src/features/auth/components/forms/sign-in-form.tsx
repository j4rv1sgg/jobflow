'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
export type SignInInputType = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const router = useRouter();
  const form = useForm<SignInInputType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { handleSubmit, setError, formState } = form;
  const [serverError, setServerError] = useState<string | null>(null);
  const onSubmit = async (data: SignInInputType) => {
    try {
      const res = await signIn(data);
      if (res.success) {
        router.replace('/dashboard');
      }
    } catch (error: unknown) {
      console.log(error);
      setServerError((error as Error)?.message ?? '');
      setError('password', {
        message: (error as Error)?.message ?? '',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && <FormMessage>{serverError}</FormMessage>}
        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  );
}
