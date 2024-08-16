"use client";
import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schema/messages";
import { useSearchParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { Loader2, Check } from "lucide-react";

function PageContent() {
  const mode = useSearchParams().get("mode") === "dark";
  const username = "shahbazathwal2107";

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    await axios.post<ApiResponse>("/api/sendmessage", {
      ...data,
      username,
    });
  }

  return (
    <div>
      <div className={`p-2 bg-transparent ${mode ? "dark" : ""}`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none text-black dark:text-white dark:bg-stone-800/50"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {form.formState.isSubmitting ? (
                <Button disabled className="h-8">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button type="submit" className="h-8">
                  {form.formState.isSubmitSuccessful ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Sent
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center h-24 items-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <PageContent />
    </Suspense>
  );
}
