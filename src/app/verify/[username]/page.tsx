"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schema/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function page() {
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: "",
    },
  });
  //   const methods = useForm();

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsVerifying(true);
      const response = await axios.post("/api/verifycode", {
        username: params.username,
        code: data.otp,
      });
      toast({
        title: "Success",
        description: response.data.message + " Sign in with your credentials",
      });
      router.replace("/signin");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failure",
        description:
          axiosError.response?.data.message ?? "Error while verifying",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-zinc-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <div className="w-full">
                        <FormLabel className="block w-full text-center mb-4">
                          Verification Code
                        </FormLabel>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="flex space-x-2">
                            <InputOTPSlot
                              index={0}
                              className="w-10 h-10 text-center border border-gray-300 rounded"
                            />
                            <InputOTPSlot
                              index={1}
                              className="w-10 h-10 text-center border border-gray-300 rounded"
                            />
                            <InputOTPSlot
                              index={2}
                              className="w-10 h-10 text-center border border-gray-300 rounded"
                            />
                            <InputOTPSlot
                              index={3}
                              className="w-10 h-10 text-center border border-gray-300 rounded"
                            />
                            <InputOTPSlot
                              index={4}
                              className="w-10 h-10 text-center border border-gray-300 rounded"
                            />
                            <InputOTPSlot
                              index={5}
                              className="w-10 h-10 text-center border border-gray-300 rounded"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <FormMessage className="block w-full text-center mb-4" />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isVerifying}
                type="submit"
                className="w-full flex items-center justify-center"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
