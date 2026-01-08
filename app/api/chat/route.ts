import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool } from 'ai';
import { number, string, z } from 'zod';
import { Product, searchProducts } from '@/lib/db/products';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const searchParams = z.object({
    query: z.string(),
});

const compareProductsParams = z.object({
    products: z.array(z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        rating: z.number(),
        reviews: z.number(),
    }))
});

const compareProductsReturn = z.object({
    message: z.string().optional(),
    ranked: z
        .array(
            z.object({
                id: z.string(),
                name: z.string(),
                price: z.number(),
                rating: z.number(),
                reviews: z.number(),
                score: z.number(),
            })
        )
        .optional(),
    best: z
        .object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            rating: z.number(),
            reviews: z.number(),
            score: z.number(),
        })
        .optional(),
});


// Define types for better type inference
type SearchResult = {
    products: {
        id: string;
        name: string;
        price: number;
        rating: number;
        reviews: number;
        image: string;
    }[];
    message: string;
};

type CompareResult = {
    message: string;
    ranked?: {
        id: string;
        name: string;
        price: number;
        rating: number;
        reviews: number;
        score: number;
    }[];
    best?: {
        id: string;
        name: string;
        price: number;
        rating: number;
        reviews: number;
        score: number;
    };
};

// Main POST handler for chat
export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google("gemini-2.5-flash"),
        messages: convertToModelMessages(messages),
        system: `
You are an AI shopping assistant.

Your responsibilities:
1. When the user searches for a product, ALWAYS call searchProducts.
2. Extract ONLY the product keyword(s) from the message.
3. If the user asks:
   - “which one is better”
   - “compare these”
   - “best among them”
   - “which is cheaper”
   - “highest rated”
   THEN:
      After retrieving products from searchProducts, call compareProducts.

Rules:
- NEVER compare by yourself. Only compare using the compareProducts tool.
- ALWAYS keep product comparison objective: rating, reviews, and price.
- If fewer than 2 products are found, explain that more data is needed.
- If user gives too many words, extract only the product keyword.

Example:
User: “Compare DSLR and mirrorless camera”
→ Extract "camera"
→ Call searchProducts({query: "camera"})
→ Then call compareProducts({products: [...]})

If no valid product keyword exists:
Respond: “Please specify what product you want to compare.”
`,
        toolChoice: "auto",
        tools: {
            searchProducts: tool({
                description: "Search products",
                parameters: z.object({
                    query: z.string(),
                }),
                execute: async ({ query }: { query: string }): Promise<SearchResult> => {
                    console.log("TOOL RECEIVED QUERY:", query);
                    if (!query || !query.trim()) {
                        return { products: [], message: "Please specify a product name." };
                    }
                    const products = await searchProducts(query);

                    if (!products.length) {
                        return { products: [], message: "No products found" };
                    }

                    const result = products.map((p: Product) => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        rating: p.rating,
                        reviews: p.reviews,
                        image: p.image,
                    }));

                    return {
                        products: result,
                        message: `Found ${result.length} result(s).`
                    };
                },
            } as any),
            compareProducts: tool({
                description: "Compare products by rating, reviews, and price.",
                parameters: compareProductsParams,
                execute: async ({ products }: z.infer<typeof compareProductsParams>): Promise<CompareResult> => {
                    if (!products || products.length < 2) {
                        return {
                            message: "Need at least 2 products to compare.",
                            ranked: [],
                            best: undefined,
                        };
                    }

                    const scored = products.map((p) => {
                        const score =
                            p.rating * 2 +
                            p.reviews * 0.02 -
                            p.price * 0.001;

                        return { ...p, score };
                    });

                    const sorted = scored.sort((a, b) => b.score - a.score);

                    return {
                        message: "Comparison complete.",
                        ranked: sorted,
                        best: sorted[0],
                    };
                },
            } as any),
        },
    });

    return result.toUIMessageStreamResponse();
}
