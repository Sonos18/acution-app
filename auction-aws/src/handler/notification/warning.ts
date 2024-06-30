import { getAuctionsToNotify } from '~/service/auction';
import { createWarning } from '~/service/notification';

export const handler = async () => {
	try {
		console.log('Checking auctions to notify...');
		const auctions = await getAuctionsToNotify();
		if (!auctions) {
			return;
		}
		console.log('Creating warnings...');
		await createWarning(auctions);
		console.log('Warnings created');
	} catch (error) {
		console.log('error', error as Error);
	}
};
