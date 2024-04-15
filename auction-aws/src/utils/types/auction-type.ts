import { CreateProductInput } from './product-type';

export interface CreateAuctionInput {
	category: string;
	image: string;
	startPrice: number;
	endPrice: number;
	currentPrice: number;
	endTime: string;
	startTime: string;
	productData: CreateProductInput;
}

export interface UpdateAuctionInput {}
export interface DeleteAuctionInput {
	auctionId: string;
}
