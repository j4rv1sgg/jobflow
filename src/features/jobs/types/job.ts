export type JobType = {
  id: number;
  userId: string;
  company: string;
  title: string;
  link: string;
  description?: string;
  status: string;
  notes?: string;
  coverLetter?: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt?: Date;
};
