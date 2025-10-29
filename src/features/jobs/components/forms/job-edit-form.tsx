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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateCoverLetter, updateJob } from '../../lib/services/jobs';
import { JobInputType, jobSchema } from '../../lib/validations/job-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { JobType } from '../../types/job';

export default function JobEditForm({
  jobData,
  setIsJobDialogOpen,
}: {
  jobData: JobType;
  setIsJobDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<JobInputType>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: jobData.company,
      title: jobData.title,
      link: jobData.link,
      status: jobData.status,
      description: jobData.description || '',
      notes: jobData.notes || '',
      coverLetter: jobData.coverLetter || '',
    },
  });
  const { formState } = form;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = form.getValues(undefined, { dirtyFields: true });
    setIsLoading(true);
    try {
      const res = await updateJob({ id: jobData.id, data });
      if (res.status === 200) {
        setIsJobDialogOpen(false);
        toast.success('Application has been updated');
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    const data = form.getValues();
    if (!data.description || data.description.trim().length <= 50) {
      toast.error('Description should be at least 50 characters');
      return;
    }
    try {
      setIsGenerating(true);
      const response = await generateCoverLetter(data);
      form.setValue('coverLetter', response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="lg:w-1/2">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex gap-2">
            <Button
              className="w-1/2 flex flex-col gap-0"
              disabled={isGenerating || isLoading || !formState.isValid}
              onClick={(e) => {
                e.preventDefault();
                handleGenerateCoverLetter();
              }}
            >
              {isGenerating ? (
                <Spinner />
              ) : (
                <>
                  <p>Generate Cover Letter</p>
                  <p className="text-[10px]">powered by AI</p>
                </>
              )}
            </Button>
            <Button type="submit" className="w-1/2" disabled={isLoading || !formState.isDirty}>
              {isLoading ? <Spinner /> : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
