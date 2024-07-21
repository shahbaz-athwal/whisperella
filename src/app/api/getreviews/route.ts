import { auth } from "@/auth";
import db from "@/lib/db";

export async function GET(request: Request) {
    const session = await auth()
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{
            status: 401
        })
    }
    const reviews = await db.review.findMany();
    console.log(reviews)
    return Response.json({ reviews: reviews.reverse() });
}