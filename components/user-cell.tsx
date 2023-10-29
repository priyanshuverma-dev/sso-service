import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { getCharFromName } from "@/lib/core";

type Props = {
  name: string;
  email: string;
  image?: string;
};

const UserCell = (props: Props) => {
  return (
    <div className="p-2 rounded-md shadow-sm hover:bg-accent hover:text-accent-foreground hover:cursor-pointer w-full">
      <div className={cn("flex items-center  flex-row mb-2")}>
        <div className="pt-3">
          <Avatar className="w-7 h-7">
            <AvatarImage src={props.image} alt={`@${props.name}`} />
            <AvatarFallback>{getCharFromName(props.name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="font-bold px-2 pt-3 text-sm">{props.name}</span>
          <span className="px-2 text-xs font-thin">{props.email}</span>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default UserCell;
