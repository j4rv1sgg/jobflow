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
import { Textarea } from '@/components/ui/textarea';
import { generateCoverLetter } from '../../lib/generate-cover-letter';

enum JobStatus {
  applied = 'applied',
  interview = 'interview',
  offer = 'offer',
  rejected = 'rejected',
}

export const jobSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  link: z.string().min(1).url(),
  status: z.enum(JobStatus),
  description: z.string().optional(),
  notes: z.string().optional(),
  coverLetter: z.string().optional(),
  appliedAt: z.date().optional(),
});

export type JobInputType = z.infer<typeof jobSchema>;

export default function JobForm() {
  const form = useForm<JobInputType>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: '',
      title: '',
      link: '',
      status: JobStatus.applied,
      description: '',
      notes: '',
      coverLetter: '',
      appliedAt: new Date(),
    },
  });
  const { handleSubmit, formState } = form;
  const onSubmit = (data: JobInputType) => {
    console.log(data);
  };

  const handleGenerateCoverLetter = async () => {
    const data = form.getValues();
    const response = await generateCoverLetter(data);
    form.setValue('coverLetter', response);
    console.log(response);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} className="max-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea rows={4} className="max-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" onClick={handleGenerateCoverLetter}>
          Generate Cover Letter
        </Button>
        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
