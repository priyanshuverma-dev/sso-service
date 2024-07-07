"use client";

import React, { useEffect, useState } from "react";
import CreateModal from "./_components/create-modal";

export default function CreatePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <CreateModal />;
}
