'use client';

import { Paperclip } from 'lucide-react';

import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/extension/file-upload';
import { Button } from '@/components/ui/button';

const FileSvgDraw = () => {
  return (
    <div className={'flex flex-col gap-y-4 items-center'}>
      <div className={'flex flex-col gap-y-1 items-center'}>
        <h4 className={'text-textBlack text-sm font-semibold'}>Drag and drop files here or upload</h4>
        <p className={'text-xs text-textBlack40'}>Accepted file types: JPEG, Doc, PDF, PNG</p>
      </div>
      <Button
        type={'button'}
        className={'h-auto py-2 px-5 border-borderSecondaryOrange border rounded-lg text-textSecondaryOrange text-sm'}
      >
        Upload
      </Button>
    </div>
  );
};
interface CustomDropzoneProps {
  files: File[] | null;
  setFiles: (files: File[] | null) => void;
}
const CustomDropzone = ({ files, setFiles }: CustomDropzoneProps) => {
  const dropZoneConfig = {
    maxSize: 1024 * 1024 * 4,
    maxFiles: 5,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
    },
  };

  return (
    <FileUploader value={files} onValueChange={setFiles} dropzoneOptions={dropZoneConfig} className="relative bg-white">
      <FileInput className="outline-dashed outline-1 outline-white">
        <div className="flex items-center justify-center flex-col py-6 px-4 w-full border-[2px] border-gray border-dashed rounded-lg border-spacing-2">
          <FileSvgDraw />
        </div>
      </FileInput>
      <FileUploaderContent className={'!p-0'}>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem
              className={'h-auto py-3 px-4 bg-white border border-borderBlack10 rounded-lg'}
              key={i}
              index={i}
            >
              <div>
                {file.type.includes('image') ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} className={'w-9 h-9'} />
                ) : (
                  <Paperclip size={16} />
                )}
              </div>
              <div className={'flex flex-col gap-y-[2px]'}>
                <h5 className={'font-semibold text-xs text-textDefault'}>{file.name}</h5>
                <span className={'font-normal text-xs text-textSecDefault'}>{Math.floor(file.size / 1000)}kb</span>
              </div>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default CustomDropzone;
