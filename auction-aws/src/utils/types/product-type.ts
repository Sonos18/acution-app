export interface CreateProductInput {
	productName: string;
	description: string;
	price: number;
	image: string;
	categoryId: string;
	origin: string;
	images: string[];
}
