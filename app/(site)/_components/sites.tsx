import db from "@/lib/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";

const fetchSites = async (userId: string) => {
  const data = await db.site.findMany({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      id: true,
      url: true,
      callbackUrl: true,
    },
  });
  return data;
};

export default async function Sites({ userId }: { userId: string }) {
  const sites = await fetchSites(userId);
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead>Site URL</TableHead>
            <TableHead>Callback URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => {
            return (
              <>
                <TableRow>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.url}</TableCell>
                  <TableCell>{site.callbackUrl.length}</TableCell>
                  <TableCell className="text-right">
                    <MoreVertical />
                  </TableCell>
                </TableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
