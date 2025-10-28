import z from "zod";
import { JobStatus } from "../../types/job";

export const jobSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  link: z.string().min(1).url(),
  status: z.enum(JobStatus),
  description: z.string().optional(),
  notes: z.string().optional(),
  coverLetter: z.string().optional(),
});

export type JobInputType = z.infer<typeof jobSchema>;
