import db from "@/lib/db";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const existingVerifiedUser = await db.user.findUnique({
      where: {
        username: username,
        isVerified: true,
      },
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is taken.",
        },
        {
          status: 409,
        }
      );
    }

    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpire = new Date(Date.now() + 1000 * 60 * 60);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists.",
          },
          {
            status: 409,
          }
        );
      } else {
        await db.user.update({
          where: {
            email,
          },
          data: {
            username,
            password: hashedPassword,
            verifyCode,
            codeExpire,
          },
        });
      }
    } else {
      const user: Prisma.UserCreateInput = {
        username,
        email,
        password: hashedPassword,
        verifyCode,
        codeExpire,
      };

      const newUser = await db.user.create({
        data: user,
      });
    }

    const emailResonse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResonse.success) {
      return Response.json(
        {
          success: false,
          message: emailResonse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error registering user.", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user.",
      },
      {
        status: 500,
      }
    );
  }
}
