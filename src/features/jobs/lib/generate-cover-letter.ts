import { api } from '@/lib/axios';
import { JobInputType } from '../components/forms/JobForm';

export const generateCoverLetter = async (jobDetails: JobInputType) => {
  try {
    const { data } = await api.post('/generate-cover-letter', jobDetails);
    return data.message.content[0].text;
  } catch (error) {
    console.error(error);
  }
};
