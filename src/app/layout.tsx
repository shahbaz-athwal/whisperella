import "./globals.css";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <body className="bg-transparent">
          {children}
          <Toaster />
        </body>
      </Provider>
    </html>
  );
}
