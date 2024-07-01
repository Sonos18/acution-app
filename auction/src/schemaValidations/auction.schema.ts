import { start } from "repl";
import { z } from "zod";

export const AuctionInput = z
  .object({
    startPrice: z.coerce.number(),
    endPrice: z.coerce.number(),
    endTime: z.date({
      required_error: "End time is required",
    }),
    startTime: z.date({
      required_error: "Start time is required",
    }),
    productName: z.string(),
    description: z.string(),
    images: z.array(z.string()),
    origin: z.string(),
    categoryId: z.string(),
  })
  .strict()
  .superRefine((data, issue) => {
    const { startPrice, endPrice, startTime, endTime, images } = data;
    if (startPrice >= endPrice) {
      issue.addIssue({
        code: "custom",
        message: "End price must be greater than start price",
        path: ["endPrice"],
      });
    }
    if (new Date(startTime) >= new Date(endTime)) {
      issue.addIssue({
        code: "custom",
        message: "End time must be greater than start time",
        path: ["endTime"],
      });
    }
    if (images.length === 0) {
      issue.addIssue({
        code: "custom",
        message: "Images is required",
        path: ["images"],
      });
    }
  });
export type AuctionInputType = z.infer<typeof AuctionInput>;
export const lastKey = z
  .object({
    auctionId: z.string(),
    status: z.string(),
  })
  .strict();
export type LastKeyType = z.infer<typeof lastKey>;
export const Auction = z
  .object({
    auctionId: z.string(),
    startPrice: z.number(),
    endPrice: z.number(),
    endTime: z.date(),
    startTime: z.date(),
    currentPrice: z.number(),
    product: z.object({
      productName: z.string(),
      description: z.string(),
      images: z.array(z.string()),
      origin: z.string(),
      category: z.string(),
    }),
    user: z.object({
      userId: z.string(),
      lastName: z.string(),
      firstName: z.string(),
      avatar: z.string(),
    }),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();
export type AuctionType = z.infer<typeof Auction>;
export const AuctionsResponse = z
  .object({
    data: z.array(Auction),
    total: z.number(),
  })
  .strict();
export type AuctionsResponseType = z.infer<typeof AuctionsResponse>;
export const AuctionClosing = z.object({
  productName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  startPrice: z.number(),
  endPrice: z.number(),
  auctionId: z.string(),
});
export type AuctionClosingType = z.infer<typeof AuctionClosing>;
