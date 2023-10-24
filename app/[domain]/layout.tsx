import { getSiteData } from "@/lib/fetcher";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SiteLayout({
  params,
  children,
}: {
  params: { domain: string };
  children: ReactNode;
}) {
  console.log(params);
  const domain = decodeURIComponent(params.domain);
  const data = await getSiteData(domain);

  if (!data) {
    notFound();
  }

  return <>{children}</>;
}
