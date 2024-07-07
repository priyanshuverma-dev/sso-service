"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { InputTags } from "@/components/ui/input-tags";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  url: z.string().url("Site URL must be valid"),
  callbackUrls: z
    .array(z.string().url("URL must be valid"))
    .nonempty("Callback URL is required"),
});

export default function CreateSiteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      callbackUrls: [],
      name: "",
      url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      console.log(values);
      const res = await fetch("/api/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status !== 200) {
        throw new Error(data.message ?? "An error occurred");
      }

      toast.success("Site created successfully");
      form.reset();
      router.push(`/`);
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="callbackUrls"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Callback URLS</FormLabel>
              <FormControl>
                <InputTags {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Working..." : "Save"}
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
