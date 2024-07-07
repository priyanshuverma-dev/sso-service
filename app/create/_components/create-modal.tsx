"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePathname, useRouter } from "next/navigation";
import CreateSiteForm from "./create-form";

export default function CreateModal() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const r = usePathname();
  const handleOnOpenChange = (open: boolean) => {
    router.back();
  };

  return (
    <AlertDialog
      open={r === "/create"}
      onOpenChange={(open) => router.push("/")}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Register site for SSO</AlertDialogTitle>
          <AlertDialogDescription>
            Fill out the form below to register your site for SSO.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <CreateSiteForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}
