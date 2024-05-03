import { HandlerFn, customErrorOutput } from '~/utils/createHandler';

import { refreshAuctionStatus } from '~/service/auction';

export const handler: HandlerFn = async (event, context, callback) => {
	try {
		await refreshAuctionStatus('spending', false);

		await refreshAuctionStatus('open', true);
	} catch (error) {
		customErrorOutput(error as Error, callback);
	}
};
