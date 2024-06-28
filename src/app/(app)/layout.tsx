import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your dashboard.",
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
  <>
    <div>hi</div>
    {children}
  </>);
}
