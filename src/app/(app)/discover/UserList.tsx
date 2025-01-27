"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Send, MessageCircle } from "lucide-react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name?: string;
  username: string;
  image?: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/getusers");
        setUsers(response.data.users);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setMessage("");
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    setIsSending(true);
    try {
      const response = await axios.post("/api/sendmessage", {
        content: message,
        username: selectedUser.username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      handleCloseDialog();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="mx-auto px-4 max-w-7xl pb-24">
      <h1 className="bg-clip-text text-center text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-3xl md:text-4xl font-sans py-12 relative z-20 font-bold tracking-tight">
        {isLoading ? (
          <Skeleton className="h-9 w-96 mx-auto" />
        ) : (
          `${users.length} People are Using Whisperella`
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-28 rounded-full" />
                </CardContent>
              </Card>
            ))
          : users.map((user) => (
              <Card
                key={user.id}
                className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>
                        {user.name?.charAt(0).toUpperCase() ||
                          user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleOpenDialog(user)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] top-[25%] md:top-[50%]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Send message to {selectedUser?.name || selectedUser?.username}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              The message you send is completely anonymous.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="hover:bg-gray-100 rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={isSending}
              className="bg-zinc-800 rounded-full hover:bg-zinc-700 text-white font-semibold py-2 px-4 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
