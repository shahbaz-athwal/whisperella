"use client";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { acceptMessageSchema } from "@/schema/messages";
import { Message, ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Copy, RefreshCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: session } = useSession();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const acceptMessages = form.watch("acceptMessages");

  function deleteMessage(messageId: string) {
    setMessages(messages.filter((m) => m.id.toString() !== messageId));
  }

  //get current status of accept message
  const fetchAcceptMessageStatus = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/acceptmessage");
      form.setValue("acceptMessages", response.data.isAcceptingMessages!);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Error getting accept message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [form, toast]);

  //get messages from backend
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/getmessages");
      setMessages(response.data.messages || []);
      toast({
        title: "Refreshed Messages",
        description: "Showing latest messages",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error getting messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessageStatus();
  }, [session, form.setValue, fetchMessages, fetchAcceptMessageStatus]);

  //flip message accept status
  const handleSwitchChange = async () => {
    try {
      const response = await axios.put<ApiResponse>(`/api/acceptmessage`, {
        acceptMessages: acceptMessages,
      });
      form.setValue("acceptMessages", !acceptMessages);
      toast({
        title: !acceptMessages ? "Yay!" : "Oh no!",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error changing status",
        variant: "destructive",
      });
    }
  };
  if (!session || !session.user) {
    return;
  }
  const { username } = session.user;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/user/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  const handleCopy = () => {
    copyToClipboard();
    setCopied(true);
  };
  return (
    <>
      <div className="flex flex-col max-w-7xl mx-auto p-5 md:p-8">
        <div>
          <h2 className="text-xl font-semibold my-4 ml-2">
            Copy Your Unique Link
          </h2>
          <div className="relative items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full bg-gray-50 border rounded-md p-4 focus:outline-none text-ellipsis"
            />
            <Button
              onClick={handleCopy}
              className="flex mx-auto my-4 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 sm:my-0"
            >
              <Copy className="w-4 h-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div className="flex justify-between mx-4 sm:mx-8 mt-6">
          <div className="flex space-x-2 items-center">
            <Switch
              {...form.register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              fetchMessages();
            }}
          >
            {isLoading ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 " />
            )}
          </Button>
        </div>

        <Separator className="my-8 h-0.5 bg-zinc-300 rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {messages.length === 0 ? (
            <div className="flex text-xl m-4">You have no messages.</div>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onMessageDelete={deleteMessage}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
