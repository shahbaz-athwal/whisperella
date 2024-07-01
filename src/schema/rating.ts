import { z } from 'zod';

export const ratingSchema = z.object({
  rating: z.number().min(1,{message: "Required"}),
  comment: z.string().max(500)
});