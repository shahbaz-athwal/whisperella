import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your dashboard.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col w-full min-h-screen justify-between">
      <div className="w-ful">
        <Navbar />
        {children}
      </div>
      <Footer />
    </main>
  );
}
