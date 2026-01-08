import { z } from "zod";

export const searchParamsSchema = z.object({
    query: z.string(),
});

export const compareProductsParamsSchema = z.object({
    products: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        rating: z.number(),
        reviews: z.number(),
    }))
});

export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
export type CompareProductsParamsInput = z.infer<typeof compareProductsParamsSchema>;
