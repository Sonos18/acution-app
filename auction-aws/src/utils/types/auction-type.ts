import { Auction } from '~/db/auction-schema';

import { CreateProductInput } from './product-type';

export interface lastKeyAuctions {
	auctionId: string;
	status: string;
}

export interface AuctionOutput {
	auctionId: string;
	user: {
		userId: string;
		firstName: string;
		lastName: string;
		avatar: string;
	};
	startPrice: number;
	endPrice: number;
	currentPrice?: number;
	startTime: string;
	endTime: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	product: {
		productId: string;
		productName: string;
		description: string;
		category: string;
		origin: string;
		images: string[];
	};
}
export interface GetAuctionsOutput {
	data: AuctionOutput[];
	total:number;
}
export interface CreateAuctionInput {
	startPrice: number;
	endPrice: number;
	endTime: string;
	startTime: string;
	productName: string;
	description: string;
	categoryId: string;
	origin: string;
	images: string[];
}

export interface UpdateAuctionInput {}
export interface DeleteOrGetOneAuctionInput {
	auctionId: string;
}
export interface GetAuctionsInput {
	nameCategory?: string;
	limit?: number;
	auctionId?: string;
	status?: string;
	page?:number;
}
export interface UpdateAuctionStatusInput {
	auctionId: string;
	status: string;
}
