 import db from "@/lib/db"
 import { usernameSchema } from "@/schema/signUp";

 export async function POST ( request : Request) {
    try {
        const { username, code } = await request.json()

        const result = usernameSchema.safeParse(username)
        console.log(result)
        
        if (!result.success) {
            const errors = result.error.format()._errors || []
            return Response.json({
                success: false,
                message: "Username format in incorrect."
            },
            {
                status: 400
            })
            
        }
        const user = await db.user.findUnique({
            where: {
                username: result.data
            }
        })

        if (!user) {
            return Response.json({
                success: false,
                message: "user not found."
            },{
                status: 409
            })
        }

        const isCodeCorrect = user?.verifyCode === code
        const isCodeValid= new Date(user.codeExpire) > new Date()

        if (isCodeCorrect && isCodeValid) {
            await db.user.update({
                where: {
                    username: result.data
                },
                data: {
                    isVerified: true
                }
            })
            return Response.json({
                success: true,
                message: "Verification successful."
            },{
                status: 200
            })

        }else if(!isCodeValid){
            return Response.json({
                success: false,
                message: "Code is expired. Sign up again."
            },{
                status: 411
            })
        }else{
            return Response.json({
                success: false,
                message: "Code is incorrect"
            },{
                status: 411
            })
        }


    } catch (error) {
        console.error("Error occured while verifying.", error);
        return Response.json({
            success: false,
            message: "Error occured while verifying"
        },{
            status: 411
        })
    }
 }