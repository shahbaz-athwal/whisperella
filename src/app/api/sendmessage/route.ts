import {  getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import db from "@/lib/db";

export async function POST(request: Request) {
    const { username, message } = await request.json()
    try {
        const user = await db.user.findUnique({
            where: {
                username: username
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
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages."
            },{
                status: 403
            }) 
        }
        await db.message.create({
            data: {
                userId: user.id,
                content: message
            }
            
        })
        return Response.json({
            success: true,
            message: "Message sent successfully."
        },{
            status: 200
        })
    } catch (error) {
        console.error("Error occured while sending message.",error)
        return Response.json({
            success: false,
            message: "Error occured while sending message."
        },{
            status: 411
        })
    }
}