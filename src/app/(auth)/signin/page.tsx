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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Page() {


    const [isSubmitting, setIsSubmitting] = useState(false);
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


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials",{
        redirect: false,
        identifier: data.identifier,
        password: data.password
    })
    if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }
  
      if (result?.url) {
        toast({
          title: 'Logged In!',
          variant: "default",
        })
        router.replace('/dashboard');
      }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-zinc-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              TrueStone
            </h1>
            <p className="mb-4">Sign in to your TrueStone account </p>
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
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
