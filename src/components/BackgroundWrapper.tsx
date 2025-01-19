"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmbedPage = pathname === "/embed";

  useEffect(() => {
    document.body.className = isEmbedPage ? "bg-transparent" : "bg-zinc-800";
  }, [isEmbedPage]);

  return <>{children}</>;
}
