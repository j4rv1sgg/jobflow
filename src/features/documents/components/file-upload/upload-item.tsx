import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash, File } from 'lucide-react';

export default function FileUploadItem({
  key,
  file,
  setUploadFiles,
}: {
  key: string;
  file: File;
  setUploadFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  return (
    <li key={key} className="relative">
      <Card className="relative p-4">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() =>
              setUploadFiles((prevFiles) =>
                prevFiles.filter((prevFile) => prevFile.name !== file.name),
              )
            }
          >
            <Trash className="h-5 w-5" aria-hidden={true} />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-3 p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <File className="h-5 w-5 text-foreground" aria-hidden={true} />
          </span>
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {file.size} bytes
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
