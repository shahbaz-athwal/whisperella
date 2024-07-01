import { z } from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(3, {message: "Required"}),
  password: z.string().min(1,{message: "Required"}),
});
