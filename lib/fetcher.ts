import { unstable_cache } from "next/cache";
import prisma from "./prisma";

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

  console.log(subdomain);

  return await unstable_cache(
    async () => {
      return prisma.user.findUnique({
        where: subdomain ? { subdomain } : { subdomain: domain },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    }
  )();
}
