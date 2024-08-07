import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Stripe } from 'stripe';

import { HandlerFn } from '~/utils/createHandler';

import { getPaymentByPaymentId, updateStatusPayment } from '~/service/payment';

const keyStripe = process.env.STRIPE_SECRET_KEY ?? '';
const keyEndpointSecret = process.env.STRIPE_ENDPOINT_SECRET ?? '';
const stripe = new Stripe(keyStripe, {
	apiVersion: '2024-04-10'
});

export const webhookHandler: HandlerFn = async (event, context, callback) => {
	try {
		const sig = event.headers['stripe-signature'] ?? '';
		const body = event.body ?? '';
		const stripeEvent = stripe.webhooks.constructEvent(body, sig, keyEndpointSecret);
		if (stripeEvent.type === 'checkout.session.completed') {
			const session = stripeEvent.data.object;
			if (!session.success_url) {
				throw new Error('Success url not found');
			}
			const paymentId = new URL(session.success_url).searchParams.get('payment_id');
			// Call your update function here
			await updatePayment(paymentId);
		}

		return {
			statusCode: 200,
			body: 'Success'
		};
	} catch (error) {
		const e = error as Error;
		return {
			statusCode: 400,
			body: JSON.stringify({ error: e.message })
		};
	}
};
const updatePayment = async (id: string | null) => {
	if (!id) {
		return {
			statusCode: 400,
			body: 'Payment id not found'
		};
	}
	await getPaymentByPaymentId(id);
	await updateStatusPayment(id, 'success');
	return {
		statusCode: 200,
		body: JSON.stringify({ id })
	};
};
