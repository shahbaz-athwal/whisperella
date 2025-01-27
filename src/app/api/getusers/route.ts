import db from "@/lib/db";
import { unstable_noStore } from "next/cache";

export async function GET(request: Request) {
  unstable_noStore();
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
    orderBy: {
      id: "desc",
    },
    where: {
      isAcceptingMessages: true,
    },
  });
  return Response.json({ users });
}
