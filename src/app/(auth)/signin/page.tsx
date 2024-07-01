"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "@/schema/signIn";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const oauthSigin = async (provider: string) => {
    await signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast({
        title: "Signin Failed",
        description: "Please check your credentials",
        variant: "destructive",
      });
    }

    if (result?.url) {
      toast({
        title: "Logged In!",
        variant: "default",
      });

      router.replace("/dashboard");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-zinc-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Whisperella
            </h1>
            <p className="mb-4">Sign in to your Whisperella account </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username/Email</FormLabel>
                      <Input
                        placeholder=""
                        {...field}
                        className="w-full bg-zinc-100"
                      />
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
                          {!showPassword ? (
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
                type="submit"
                className="w-full flex items-center justify-center"
              >
                Sign In
              </Button>
            </form>
          </Form>
          <div className="flex justify-center">
          <Separator className="my-4 rounded h-0.5 w-32" />
          <div className="pt-1.5 pl-2 pr-2 text-sm text-zinc-500">or</div>
          <Separator className="my-4 rounded h-0.5 w-32" />
          </div>
          <Button
            onClick={() => {
              oauthSigin("github");
            }}
            className="w-full flex items-center justify-center mt-4"
          >
            Sign In with GitHub
          </Button>
          <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/signup" className="text-gray-600 underline hover:text-black">
              Sign up
            </Link>
          </p>
        </div>
        </div>
      </div>
    </>
  );
}
