import { resend } from "./resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const emailBody = {
      from: "ShahCodes <verify@shahcodes.in>",
      to: ["shahbazathwal2107@gmail.com"],
      subject: "Verification Code",
      react: VerificationEmail({
        username,
        otp: otp,
      }),
    };
    
    await resend.emails.send(emailBody);

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email.", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
