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
    <div className="bg-zinc-800 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16 flex-1 flex flex-col justify-between bg-white w-full">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
