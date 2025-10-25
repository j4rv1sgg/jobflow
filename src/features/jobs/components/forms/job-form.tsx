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
import { generateCoverLetter } from '../../lib/generate-cover-letter';
import {
  JobInputType,
  jobSchema,
  JobStatus,
} from '../../lib/validations/job-schema';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function JobForm({setIsAddJobOpen}: {setIsAddJobOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  const router = useRouter();
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
    },
  });
  const { handleSubmit, formState } = form;

  const onSubmit = async (data: JobInputType) => {
    try {
      const res = await api.post('/jobs', data);
      if(res.status === 201) {
        form.reset();
        toast.success("Application has been saved")
        router.refresh();
      }
      setIsAddJobOpen(false)
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong")
    }
  };

  const handleGenerateCoverLetter = async () => {
    const data = form.getValues();
    const response = await generateCoverLetter(data);
    form.setValue('coverLetter', response);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex gap-2">
          <Button className="w-1/2 flex flex-col gap-0" onClick={handleGenerateCoverLetter}>
            <p>Generate Cover Letter</p>
            <p className='text-[10px]'>powered by AI</p>
          </Button>
          <Button
            type="submit"
            className="w-1/2"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
