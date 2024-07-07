import db from "@/lib/db";

export async function GET(request: Request) {
    const reviews = await db.review.findMany()
    return Response.json({reviews: reviews.reverse()})
}
