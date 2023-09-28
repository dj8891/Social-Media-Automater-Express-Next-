"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/user-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader } from "../loader";

export const ImportWooCommerceImage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [wooProductImages, setWooProductImages] = useState([]);
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "importWooCommerceImage";

  const { wooCommerceProduct } = data;

  useEffect(() => {
    const getWooProductImages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/wooCommerce/getWooProductImages/${wooCommerceProduct?.id}`
        );

        if (response.status === 200) {
          setWooProductImages(response.data);
        } else {
          toast.error("Failed to generate posts"); // Show an error toast
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getWooProductImages();
  }, [wooCommerceProduct]);

  const onSubmit = async () => {
    try {
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Images for {wooCommerceProduct?.name}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader />
        ) : wooProductImages.length == 0 ? (
          <div>NO PRODUCT IMAGE FOUND</div>
        ) : (
          <>{JSON.stringify(wooProductImages)}</>
        )}
      </DialogContent>
    </Dialog>
  );
};
