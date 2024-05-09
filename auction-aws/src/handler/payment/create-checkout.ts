import Stripe from 'stripe';
import { ObjectSchema, number, object, string } from 'yup';

import { Payment } from '~/db/payment-schema';

import { HandlerFn, customErrorOutput } from '~/utils/createHandler';
import { extractBodyDataFromRequest } from '~/utils/validate-request/validate-body';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		const data = extractBodyDataFromRequest({ event, schema: checkoutSchema });
		const keyStripe = process.env.STRIPE_SECRET_KEY ?? '';
		console.log('keyStripe', keyStripe);
		const stripe = new Stripe(keyStripe);
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'T-shirt'
						},
						unit_amount: data.total * 100
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `http://localhost:3000/payment/success?payment_id=${data.paymentId}`,
			cancel_url: `http://localhost:3000/payment`
		});
		callback(null, {
			statusCode: 200,
			body: JSON.stringify({ id: session.id })
		});
	} catch (error) {
		console.log('error', error);

		customErrorOutput(error as Error, callback);
	}
};

export const checkoutSchema: ObjectSchema<Payment> = object({
	auctionId: string().required(),
	paymentId: string().required(),
	total: number().required(),
	createdAt: string().required(),
	userId: string().required(),
	status: string().required()
});
