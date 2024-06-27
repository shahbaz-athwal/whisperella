import { z } from "zod";
import { usernameSchema } from "./signUp";

export const signInSchema = z.object({
  identifier: z.string().email({ message: "Invalid email" }) || usernameSchema,
  password: z.string(),
});
