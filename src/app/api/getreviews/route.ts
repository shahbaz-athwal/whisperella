import db from "@/lib/db";

export async function GET(request: Request) {
    
    const reviews = await db.review.findMany()
    if (!reviews) {
        return Response.json({
            success: false,
            message: "Could not get reviews"
        },{
            status: 411
        })
    }
    return Response.json({
        success: true,
        reviews: reviews.reverse()
        
    },{
        status: 200
    })
}
