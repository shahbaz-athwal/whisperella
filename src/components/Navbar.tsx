"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-zinc-800 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-4xl font-bold mb-4 md:mb-0">
          TrueStone
        </a>
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block">Welcome, {user.name || user.username}</span>
            <Avatar className="mr-2">
              <AvatarImage src={user.image as string} />
              <AvatarFallback className="bg-black">{"O"}</AvatarFallback>
            </Avatar>
            <Button
              onClick={() => signOut()}
              className="w-auto md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/signin">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
