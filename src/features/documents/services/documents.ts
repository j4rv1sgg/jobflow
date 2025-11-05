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

export const getDocuments = async () => {
  try {
    const res = await api.get('/documents');
    return res;
  } catch (err) {
    console.error('Error getting documents:', err);
  }
};
