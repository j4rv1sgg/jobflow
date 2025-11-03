import { api } from '@/lib/axios';

export const uploadDocument = async (formData: FormData) => {
  try {
    const res = await api.post('/documents/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return res;
  } catch (err) {
    console.error('Error uploading document:', err);
  }
};
