export type JobType = {
  id: string;
  userId: string;
  company: string;
  title: string;
  link: string;
  description: string | null;
  status: string;
  notes: string | null;
  coverLetter: string | null;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date | null;
};
