import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/toaster";
import BackgroundWrapper from "@/components/BackgroundWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Whisperella",
  description: "Sending anonymous messages made easier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body>
          <BackgroundWrapper>{children}</BackgroundWrapper>
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
