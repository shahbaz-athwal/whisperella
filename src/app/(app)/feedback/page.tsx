"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import Rating from "@/components/Rating";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ratingSchema } from "@/schema/rating";

export default function RatingsPage()  {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
  });

  const [rating, setRating] = useState(0);

  const onSubmit = async (data: z.infer<typeof ratingSchema>) => {
    try {
      await axios.post("/api/rating", data);
      console.log(data)
      toast({
        title: "Success",
        description: "Your rating is submitted. Thank You!",
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Failed",
        description: "Failed to send rating",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="w-full mx-auto p-6 sm:p-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Rate Our Service</h1>
      <h1 className="text-xl mb-12 text-center">Your review will be featured on home page</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="rating"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Rating</FormLabel>

                <Rating
                  rating={rating}
                  onRate={(rate: number) => {
                    setRating(rate);
                    form.setValue("rating", rate);
                  }}
                />
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Comment</FormLabel>
                <textarea
                  {...form.register("comment")}
                  className={"w-full p-2 border rounded"}
                  rows={4}
                  placeholder="Leave a comment or suggestion"
                ></textarea>

                <FormMessage/>
              </FormItem>
            )}
          />
          <div className="flex justify-center">
          <Button className="bg-zinc-800" type="submit">Send</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

