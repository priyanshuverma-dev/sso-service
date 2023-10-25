"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isclient, setIsclient] = useState(false);

  useEffect(() => {
    setIsclient(true);
  }, []);

  if (isclient) {
    const hostname = window.location.href;
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-2xl">Domain: {hostname}</h1>
      </main>
    );
  }
}
