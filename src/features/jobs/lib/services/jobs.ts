import { api } from '@/lib/axios';
import { JobInputType } from '../validations/job-schema';

export async function postJob(data: JobInputType) {
  const res = await api.post('/jobs', data);
  if (res.status !== 201) throw new Error('Failed to post jobs');
  return res;
}

export async function deleteJob(id: string) {
  const res = await api.delete(`/jobs?id=${id}`);
  if (res.status !== 200) throw new Error('Failed to delete job');
  return res;
}

export async function updateJob({
  id,
  data,
}: {
  id: string;
  data: Partial<JobInputType>;
}) {
  const res = await api.patch(`/jobs?id=${id}`, {
    ...data,
    updatedAt: new Date(),
  });
  if (res.statusText !== 'OK') throw new Error('Failed to update job');
  return res;
}

export const generateCoverLetter = async (jobDetails: JobInputType) => {
  try {
    const { data } = await api.post('/generate-cover-letter', jobDetails);
    return data.message.content[0].text;
  } catch (error) {
    console.error(error);
  }
};
