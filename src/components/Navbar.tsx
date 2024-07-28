"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import { AlignJustify } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-zinc-800 text-white">
      <div className="flex max-w-7xl mx-auto justify-between">
        <a href="/" className="text-4xl sm:text-5xl font-bold">
          Whisperella
        </a>
        <div className="flex space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline-block ">
                Welcome, {user.name || user.username}
              </span>
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback className="bg-black">
                  {user.username ? user.username[0].toUpperCase() : "O"}
                </AvatarFallback>
              </Avatar>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-slate-100 text-black hidden md:inline-block"
                variant={"outline"}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/signin">
              <Button
                className="bg-slate-100 text-black mt-1"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <button>
                <AlignJustify className="size-11 hover:text-gray-300" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-72 lg:w-full bg-zinc-700 backdrop-blur-lg bg-opacity-40">
              <div className="flex flex-col space-y-4 w-full mt-10">
                <SheetClose asChild>
                  <Link href="/dashboard" className="w-full">
                    <Button className="w-full" variant={"secondary"}>
                      Dashboard
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/discover" className="w-full">
                    <Button className="w-full" variant={"secondary"}>
                      Find People
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/feedback" className="w-full">
                    <Button className="w-full" variant={"secondary"}>
                      Leave a Review
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/user/shahbazathwal2107">
                    <Button className="w-full" variant={"secondary"}>
                      Send Admin a Message
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="https://shahcodes.in" target="_blank">
                    <Button className="w-full" variant={"secondary"}>
                      About The Developer
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={session ? "" : "hidden"}
                  >
                    Logout
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
