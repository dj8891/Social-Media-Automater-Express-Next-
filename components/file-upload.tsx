"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { toast } from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  values: string[];
  endpoint: "postImage";
}

export const FileUpload = ({ onChange, values, endpoint }: FileUploadProps) => {
  const uploadedImages = values.map((value) => {
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
      return (
        <div className="relative mt-2 w-80 h-48 p-2 m-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center">
          <Image
            objectFit="cover"
            fill
            src={value}
            alt="Upload"
            className="rounded-sm"
          />
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (value && fileType === "pdf") {
      return (
        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          >
            {value}
          </a>
          <button
            onClick={() => onChange("")}
            className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      );
    }
  });

  return (
    <>
      {uploadedImages}
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          toast.error(`Could not upload due to ${error.message}`);
          console.log(error);
        }}
      />
    </>
  );
};
