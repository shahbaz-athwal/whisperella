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
import { Copy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { Separator } from "@radix-ui/react-separator";


export default function page() {
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
      console.log(axiosError)
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Error getting accept message status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [form.setValue, toast]);

  //get messages from backend
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setIsSwitchLoading(true);
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
    }
  }, [setIsLoading, setMessages, toast]);

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessageStatus();
  }, [session, form.setValue, toast, fetchAcceptMessageStatus, fetchMessages]);

  //flip message accept status
  const handleSwitchChange = async () => {
    try {
      const response = await axios.put<ApiResponse>(`/api/acceptmessage`, {
        acceptMessages: acceptMessages,
      });
      form.setValue("acceptMessages", !acceptMessages);
      toast({
        title: !acceptMessages? "Yay!": "Oh no!",
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
      <div className="mb-4">
        <h2 className="text-lg ml-6 font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="relative flex items-center p-4 border rounded-md bg-gray-50 ml-5 mr-5">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full bg-transparent focus:outline-none"
          />
          <Button onClick={handleCopy} className="absolute right-4">
            <Copy className="w-4 h-4 mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...form.register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator className="my-3" />

      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onMessageDelete={deleteMessage}
        />
      ))}
    </>
  );
}
