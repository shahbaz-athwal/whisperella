import { z } from "zod";

export const messageSchema = z.object({
  content: z.string(),
});

export const acceptMessageSchema = z.object({
    acceptMessages: z.boolean(),
})