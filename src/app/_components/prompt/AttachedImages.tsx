import { Button } from "@/src/components/ui/button";
import { XCircleIcon } from "lucide-react";
import type { Dispatch, FC, RefObject, SetStateAction } from "react";

export const AttachedImages: FC<{
  files: FileList | null;
  setFiles: Dispatch<SetStateAction<FileList | null>>;
  attachmentsRef: RefObject<Set<HTMLImageElement | null>>;
}> = ({ files, setFiles, attachmentsRef }) => {
  return (
    <div className="p-2 flex gap-1 overflow-auto">
      {files &&
        Array.from(files).map((file, i) => (
          <div key={i} className="relative flex flex-wrap items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={i}
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="max-h-40 max-w-50 rounded-md object-contain"
              ref={(img) => {
                attachmentsRef.current.add(img);
              }}
            />
            <Button
              type="button"
              size={"icon"}
              variant={"ghost"}
              className="cursor-pointer absolute right-0 top-0 hover:bg-accent/60 rounded-full dark:hover:bg-accent-foreground/30"
              onClick={() => {
                setFiles((prevFiles) => {
                  const dataTransfer = new DataTransfer();
                  [...(prevFiles ?? [])].forEach((prevFile) => {
                    if (prevFile.name !== file.name) {
                      dataTransfer.items.add(prevFile);
                    }
                  });
                  return dataTransfer.files;
                });
              }}
            >
              <XCircleIcon />
            </Button>
          </div>
        ))}
    </div>
  );
};
