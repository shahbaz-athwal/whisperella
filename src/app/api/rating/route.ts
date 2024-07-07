import { auth } from "@/auth";
import db from "@/lib/db";
import { ratingSchema } from "@/schema/rating";

export async function POST(req: Request) {
  const data = await req.json();
  const parsedData = ratingSchema.safeParse(data);

  if (parsedData.error) {
    return Response.json(
      {
        success: false,
        message: "Data is invalid",
      },
      {
        status: 409,
      }
    );
  }

  const session = await auth();
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const review = await db.review.create({
      data: {
        name: session.user.name,
        username: session.user.username,
        comment: parsedData.data.comment,
        image: session.user.image,
        rating: Number(parsedData.data.rating),
      },
    });
    if (!review) {
      return Response.json(
        {
          success: false,
          message: "Error creating review",
        },
        {
          status: 401,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Thanks for review",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to get messages.", error);
    return Response.json(
      {
        success: false,
        message: "Database erro",
      },
      {
        status: 411,
      }
    );
  }
}
