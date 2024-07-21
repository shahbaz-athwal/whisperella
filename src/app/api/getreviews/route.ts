import db from "@/lib/db";

export async function GET(request: Request) {

    const reviews = await db.review.findMany();
    console.log('Setting headers for reviews response');
    return new Response(JSON.stringify({ reviews: reviews.reverse() }), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        }
    });
}