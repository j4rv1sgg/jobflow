'use client';

import React from 'react';
import UploadDialog from '@/features/documents/components/file-upload/upload-dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadDocument } from '@/features/documents/services/documents';
import { DocumentSelect } from '../types/document';

type DocumentType = DocumentSelect & {
  downloadUrl: string
}

export default function Documents({ docData }: { docData: DocumentType[]}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([]);
  const [isUploading, setUploading] = useState(false);

  const handleUpload = async (documentTitle: string) => {
    if (uploadFiles.length === 0) {
      toast.error('Please select a file');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('documentTitle', documentTitle);
    formData.append('file', uploadFiles[0]);
    const res = await uploadDocument(formData);
    if (res?.status === 201) {
      setIsDialogOpen(false);
      toast.success('Document uploaded successfully');
    }
    setUploading(false);
  };

  return (
    <div className="p-6">
      <Button
        variant="default"
        size="sm"
        className="w-fit"
        onClick={() => setIsDialogOpen(true)}
      >
        <IconPlus />
        <span className="hidden lg:inline">Upload CV</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <form>
          <UploadDialog
            uploadFiles={uploadFiles}
            setUploadFiles={setUploadFiles}
            handleUpload={handleUpload}
            isUploading={isUploading}
          />
        </form>
      </Dialog>
      {docData.length > 0 ? (
        <ul className="space-y-2">
          {docData.map((doc: DocumentType) => (
            <li
              key={doc.id}
              className="border rounded-xl p-4 flex justify-between items-center"
            >
              <div className="flex">
                <iframe
                  src={doc.downloadUrl}
                  height="400"
                  className="rounded-lg border"
                />
                <p className="font-medium">{doc.documentTitle}</p>
                <p className="text-sm text-gray-500">
                  Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm whitespace-pre-line line-clamp-2 text-gray-600 mt-1">
                  {doc.summary ? (
                    doc.summary
                  ) : (
                    'No summary available'
                  )}
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View / Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No documents uploaded yet.</p>
      )}
    </div>
  );
}
