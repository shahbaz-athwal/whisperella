import db from "@/lib/db";
import { unstable_noStore } from "next/cache";

export async function GET(request: Request) {
  unstable_noStore();
  const reviews = await db.review.findMany({
    orderBy: {
        id: "desc"
    }
  });
  return Response.json({ reviews });
}
