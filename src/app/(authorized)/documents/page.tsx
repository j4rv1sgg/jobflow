'use client';

import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import UploadDialog from '@/features/documents/components/file-upload/upload-dialog';
import { uploadDocument } from '@/features/documents/services/documents';

export default function Documents() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const handleUpload = async (documentTitle: string) => {
    if (files.length === 0) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('documentTitle', documentTitle);
    formData.append('file', files[0]);
    const res = await uploadDocument(formData);
    console.log(res);
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
              files={files}
              setFiles={setFiles}
              handleUpload={handleUpload}
            />
          </form>
        </Dialog>
      </div>
    </>
  );
}
