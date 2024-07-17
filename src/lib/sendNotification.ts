import NotificationEmail from "../../emails/NotificationEmail";
import { resend } from "./resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendNotification(
  email: string,
  username: string,
): Promise<ApiResponse> {
  try {
    const emailBody = {
      from: "Whisperella <notification@shahcodes.in>",
      to: email,
      subject: "New Anonymous Message!",
      react: NotificationEmail(username),
    };
    
    await resend.emails.send(emailBody);

    return {
      success: true,
      message: "Notification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending notification email.", error);
    return {
      success: false,
      message: "Failed to send notification",
    };
  }
}
