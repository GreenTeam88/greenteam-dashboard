import { Input } from '@/components/ui/input';

interface CustomFileInputProps {
  multiple?: boolean;
  files: FileList | undefined;
  setFiles: (files: FileList) => void;
}

export default function CustomFileInput({ multiple = false, setFiles }: CustomFileInputProps) {
  return <Input onInput={(data) => setFiles(data.currentTarget.files as FileList)} type="file" multiple={multiple} />;
}
