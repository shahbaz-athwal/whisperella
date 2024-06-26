import db from "@/lib/db";
import z from "zod"
import { usernameSchema, signUpSchema } from "@/schema/signUp";

const UsernameQuerySchema = z.object({
    username: usernameSchema
})

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url)
        const queryParam= {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)

        if (!result.success) {
            const errors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Username format in incorrect."
            },
            {
                status: 400
            })

        }
        const { username } = result.data
        const userFromDb = await db.user.findUnique({
            where: {
                username: username,
                isVerified: true
            }
        })
        if (userFromDb) {
            return Response.json({
                success: false,
                message: "Username is taken."
            },
            {
                status: 409
            })
        }
        return Response.json({
            success: true,
            message: "Username is available."
        },
        {
            status: 200
        })
    } catch (error) {
        console.error("Error checking username.",error)
        return Response.json({
            success: false,
            message: "Error checking username."
        },
        {
            status: 400
        })
    }
}