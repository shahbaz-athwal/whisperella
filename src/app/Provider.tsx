"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmbedPage = pathname === "/embed";

  useEffect(() => {
    if (isEmbedPage) {
      document.body.classList.remove("bg-zinc-800");
      document.body.classList.add("bg-transparent");
    } else {
      document.body.classList.remove("bg-transparent");
      document.body.classList.add("bg-zinc-800");
    }
  }, [isEmbedPage]);

  return <SessionProvider>{children}</SessionProvider>;
}
