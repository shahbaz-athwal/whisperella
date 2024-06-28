import { z } from "zod";

export const messageSchema = z.object({
  content: z.string().min(3, {message: "Message must be atleast 3 characters."}),
});

export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean(),
})