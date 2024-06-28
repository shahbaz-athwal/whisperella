import { getServerSession } from "next-auth/next";
import db from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function DELETE(request: Request, 
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  const session = await getServerSession(authOptions);
  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  try {
    const updateResult = await db.message.delete({
      where: {
        id: Number(messageId)
      }
    });

    if (!updateResult) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
