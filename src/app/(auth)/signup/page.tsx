"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/schema/signUp";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 500);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get<ApiResponse>(
            `/api/uniqueusername?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error while signing up.", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ?? "Error while signing up.";
      toast({
        title: "Failure",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-zinc-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join TrueStone
            </h1>
            <p className="mb-4">Sign up to start getting anonymous messages </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <div className="relative items-center space-x-2">
                        <Input
                          placeholder=""
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedUsername(e.target.value);
                          }}
                          className="w-full bg-zinc-100 pr-10"
                        />
                        {isCheckingUsername && (
                          <Loader2 className="animate-spin absolute inset-y-0 right-0  flex items-center text-gray-500" />
                        )}
                      </div>
                      {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-sm ${
                            usernameMessage === "username is available"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="" {...field} className="w-full bg-zinc-100" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder=""
                          {...field}
                          className="w-full bg-zinc-100 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
