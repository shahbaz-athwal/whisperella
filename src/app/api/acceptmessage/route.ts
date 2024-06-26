import {  getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { number } from "zod";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
    const user = session?.user 
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        },{
            status: 401
        })
    }
    const userId = session.user.userId
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await db.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                isAcceptingMessages: acceptMessages
            }
        })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 411
            })
        }
        return Response.json({
            success: true,
            message: "Accept message toggled",
            updatedUser
        },{
            status: 200
        })

    } catch (error) {
        console.error("Error toggling accept message",error)
        return Response.json({
            success: false,
            message: "Error toggling accept message"
        },{
            status: 401
        })
    }
    
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    const user = session?.user 
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
        const user = await db.user.findUnique({
            where: {
                id: Number(userId)
            }
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },{
                status: 411
            })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: user.isAcceptingMessages
        },{
            status: 200
        })
    } catch (error) {
        console.error("Error getting accept message",error)
        return Response.json({
            success: false,
            message: "Error getting accept message"
        },{
            status: 401
        })
    }
}