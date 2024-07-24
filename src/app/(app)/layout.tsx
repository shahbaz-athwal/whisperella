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
    <div className="bg-zinc-800">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-white pt-12">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
