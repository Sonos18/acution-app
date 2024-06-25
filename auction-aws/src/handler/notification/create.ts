import { getAuctionsToNotify } from '~/service/auction';
import { createWarning } from '~/service/notification';

export const handler = async () => {
	try {
		const auctions = await getAuctionsToNotify();
		if (!auctions) {
			return;
		}
		await createWarning(auctions);
	} catch (error) {
		console.log('error', error as Error);
	}
};
