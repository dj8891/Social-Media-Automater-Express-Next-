"use client";

import { useEffect, useState } from "react";
import { ImportWooCommerceImage } from "../modals/import-woocommerce-image";
import { ProModal } from "../modals/pro-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ProModal />
      <ImportWooCommerceImage />
    </>
  );
};
