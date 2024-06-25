import { Payment } from '~/db/payment-schema';

import { HandlerFn } from '~/utils/createHandler';

import { countCategory } from '~/service/category';
import { getPaymentsByStatusSuccess, getPaymentsForSevenDay } from '~/service/payment';
import { countProduct } from '~/service/product';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const { categories, products, payments } = await getData();
		const res = treeShakingDataChart(categories, products, payments);
		callback(null, { statusCode: 200, body: JSON.stringify(res) });
	} catch (error) {}
};
const getData = async () => {
	const categories = await countCategory();
	console.log('categories', categories);
	const products = await countProduct();
	console.log('products', products);
	const payments = await getPaymentsByStatusSuccess();
	return {
		categories,
		products,
		payments
	};
};
const getDailyPayments = (payments: Payment[] | []) => {
	// Create an array to store the total payments per day
	const dailyTotals: { date: string; total: number }[] = [];

	// Initialize dailyTotals with an object for each day in the last 7 days
	for (let i = 0; i < 7; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
		dailyTotals.push({ date: `${day}/${month}`, total: 0 });
	}

	payments.forEach((payment) => {
		// Extract the day from the createdAt date string
		const paymentDate = new Date(payment.createdAt);

		// Find the object for this date in the array
		const day = paymentDate.getDate().toString().padStart(2, '0');
		const month = (paymentDate.getMonth() + 1).toString().padStart(2, '0'); // +1 because months are 0-indexed
		const date = `${day}/${month}`;
		const dayTotal = dailyTotals.find((dt) => dt.date === date);

		// If there is an object for this date, add the payment total to the total for this day
		if (dayTotal) {
			dayTotal.total += payment.total;
		}
	});

	return dailyTotals;
};
const treeShakingDataChart = (categories: number, products: number, payments: Payment[]) => {
	return {
		payments: payments.length,
		total: payments.map((payment) => payment.total).reduce((a, b) => a + b, 0),
		products: products,
		categories: categories,
		users: 0,
		active: 0,
		chartData: getDailyPayments(payments)
	};
};
