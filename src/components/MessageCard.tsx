"use client";
import { Message } from "@/types/ApiResponse";
import React from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { ShareIcon, X } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import ShareButton from "@/components/MesssageToImage";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/deletemessage/${message.id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message.id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-7 h-full">
          <div className="flex flex-col justify-between gap-6 col-span-6">
            <CardTitle className="text-xl break-words overflow-hidden max-w-[85%]">
              {message.content}
            </CardTitle>

            {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
          </div>

          <div className="flex flex-col justify-between gap-4 col-span-1 ">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" className="max-w-16" variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-11/12 rounded">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {isMobileDevice() ? (
              <ShareButton message={message.content} className="w-5 h-5" />
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="max-w-16" variant={"outline"}>
                    <ShareIcon className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-11/12 rounded">
                  <AlertDialogHeader>
                    <AlertDialogTitle></AlertDialogTitle>

                    <AlertDialogDescription className="text-zinc-800">
                      Sharing is only supported in mobile devices.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Ok</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
