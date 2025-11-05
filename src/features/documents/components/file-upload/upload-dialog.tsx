import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FileUploadItem from './upload-item';
import { Label } from '@/components/ui/label';
import { File } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface Props {
  uploadFiles: File[];
  setUploadFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleUpload: (documentTitle: string) => void;
  isUploading: boolean;
}

export default function UploadDialog({isUploading, uploadFiles, setUploadFiles, handleUpload }: Props) {
  const [documentTitle, setDocumentTitle] = useState<string>('');
  const handleDrop = (acceptedFiles: File[]) => {
    if (uploadFiles.length > 0) {
      toast.error('You can only upload one file');
      return;
    }
    setUploadFiles(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Upload CV</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        <div className="col-span-full sm:col-span-3">
          <Label htmlFor="file-name" className="font-medium">
            File name
          </Label>
          <Input
            type="text"
            id="file-name"
            name="file-name"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="File name"
            className="mt-2"
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="file-upload-2" className="font-medium">
            File upload
          </Label>
          <div
            {...getRootProps()}
            className={cn(
              isDragActive
                ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                : 'border-border',
              'mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200',
            )}
          >
            <div>
              <File
                className="mx-auto h-12 w-12 text-muted-foreground/80"
                aria-hidden={true}
              />
              <div className="mt-4 flex text-muted-foreground">
                <p>Drag and drop or</p>
                <label
                  htmlFor="file"
                  className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4"
                >
                  <span>choose file</span>
                  <input
                    {...getInputProps()}
                    id="file-upload-2"
                    name="file-upload-2"
                    accept=".pdf"
                    type="file"
                    disabled={uploadFiles.length > 0}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">to upload</p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
            <span>Only PDF are allowed to upload.</span>
            <span className="pl-1 sm:pl-0">Max. size of file: 5MB</span>
          </p>
          {uploadFiles.length > 0 && (
            <>
              <h4 className="mt-6 font-medium text-foreground">
                File to upload
              </h4>
              <ul role="list" className="mt-4 space-y-4">
                {uploadFiles.map((file) => (
                  <FileUploadItem
                    key={file.name}
                    file={file}
                    setUploadFiles={setUploadFiles}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={isUploading} onClick={() => handleUpload(documentTitle)}>
          {isUploading ? <Spinner /> : 'Upload'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
