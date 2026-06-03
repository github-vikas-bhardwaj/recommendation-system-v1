"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function FlashToast({ message, id }: { message: string; id: string }) {
  useEffect(() => {
    toast.success(message, { id });
  }, [message, id]);

  return null;
}
