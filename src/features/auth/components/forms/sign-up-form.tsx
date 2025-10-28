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
import { signUp } from '@/lib/actions/auth-actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'Name is too short'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 chars'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 chars'),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );
export type SignUpInputType = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<SignUpInputType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit = async (data: SignUpInputType) => {
    setIsLoading(true);
    try {
      const res = await signUp(data);
      if (res.success) {
        router.replace('/dashboard');
      } else {
        setServerError(res.message ?? '');
      }
    } catch (error: unknown) {
      console.log((error as Error)?.message ?? '');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setServerError(null);
                  }}
                />
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Retype your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && <FormMessage>{serverError}</FormMessage>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}
