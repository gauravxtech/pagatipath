import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileUploaderProps {
  bucket: string;
  path: string;
  accept?: string;
  maxSize?: number; // in MB
  onUploadComplete?: (url: string) => void;
  currentFile?: string;
}

export function FileUploader({
  bucket,
  path,
  accept = '*/*',
  maxSize = 5,
  onUploadComplete,
  currentFile,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      toast.success('File uploaded successfully!');
      onUploadComplete?.(publicUrl);
      setFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!file && !currentFile && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose File
        </Button>
      )}

      {file && (
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <File className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {currentFile && !file && (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          <File className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">Current file uploaded</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace
          </Button>
        </div>
      )}

      {file && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
      )}
    </div>
  );
}
