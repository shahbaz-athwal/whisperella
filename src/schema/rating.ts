import { z } from 'zod';

export const ratingSchema = z.object({
  rating: z.number().min(1,{message: "Minimum 1 required"}).max(5,{message: 'maximum 5'}),
  comment: z.string().max(500)
});