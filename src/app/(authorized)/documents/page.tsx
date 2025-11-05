'use client';

import React from 'react';
import UploadDialog from '@/features/documents/components/file-upload/upload-dialog';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadDocument } from '@/features/documents/services/documents';

export default function Documents() {
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
    <>
      <SiteHeader page="Documents" />
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
      </div>
    </>
  );
}
