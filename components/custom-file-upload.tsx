"use client";

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";

import "@uploadthing/react/styles.css";
import { toast } from "react-hot-toast";
import { Separator } from "./ui/separator";
import { useModal } from "@/hooks/user-modal-store";

interface FileUploadProps {
  onChange: (url?: string) => void;
  values: string[];
  endpoint: "postImage";
  product: { id: number; name: string };
}

export const CustomFileUpload = ({
  onChange,
  values,
  endpoint,
  product,
}: FileUploadProps) => {
  const { onOpen } = useModal();
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
            onClick={() => onChange(value)}
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
            onClick={() => onChange(value)}
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
    <div className="flex flex-col justify-start items-start">
      <div className="flex flex-row">
        <div
          onClick={() =>
            onOpen("importWooCommerceImage", {
              wooCommerceProduct: product,
            })
          }
          className="cursor-pointer w-52 h-40 mt-2 p-2 m-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center"
        >
          <Image
            width={100}
            height={50}
            src="/woocommerce.png"
            alt="Upload From WooCommerce"
            className="rounded-sm"
          />
          <h2 className="text-blue-600 font-sans font-semibold">
            Import images from WooCommerce
          </h2>
          <p className="text-xs text-gray-500 font-sans">
            You can see images uploaded to your product
          </p>
        </div>

        <UploadDropzone
          className="w-52 h-40"
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            toast.error(`Could not upload due to ${error.message}`);
            console.log(error);
          }}
        />
      </div>

      <Separator className="my-8" />

      <div className="flex flex-row">{uploadedImages}</div>
    </div>
  );
};
