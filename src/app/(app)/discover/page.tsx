import { Metadata } from "next";
import UserList from "./UserList";

export const metadata: Metadata = {
  title: "Discover - Whisperella",
  description: "Discover new users",
};

export default function Home() {
  return (
    <main>
      <UserList />
    </main>
  );
}
