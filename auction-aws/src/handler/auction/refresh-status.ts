import { HandlerFn, customErrorOutput } from '~/utils/createHandler';

import { refreshAuctionStatus } from '~/service/auction';

export const handler = async () => {
	try {
		console.log('Refreshing auctions status...');
		await refreshAuctionStatus('spending', false);
		console.log('Spending auctions refreshed');
		await refreshAuctionStatus('open', true);
		console.log('Open auctions refreshed');
	} catch (error) {
		console.log('error', (error as Error).message);
		
	}
};
