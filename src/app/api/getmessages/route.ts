import {  getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import db from "@/lib/db";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{
            status: 401
        })
    }
    const userId = session.user.userId
    try {
        const messages = await db.message.findMany({
            where: {
                userId: Number(userId)
            }
        })
        if (!messages) {
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 411
            })
        }
        return Response.json({
            success: true,
            messages: messages
            
        },{
            status: 200
        })
    } catch (error) {
        console.error("Failed to get messages.", error)
        return Response.json({
            success: false,
            message: "Failed to get messages"
        },{
            status: 411
        })
    }
}