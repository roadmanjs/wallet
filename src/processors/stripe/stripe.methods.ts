import {log, verbose} from '@roadmanjs/logs';

import {StripeDataObject} from './response.interface';
import {updateWallet} from '../../wallet/Wallet.methods';

/**
 * Fullfil a payment from stripe
 * TODO should be called from a message broker
 * @param metadata
 */
export const fulfillStripePayment = async (stripeData: StripeDataObject): Promise<void> => {
    const metadata = stripeData.metadata;

    verbose('Fulfilling metadata', metadata);

    try {
        const {owner = '', amount = 0} = metadata;

        const intentType = metadata.intentType || '';
        const intentId = metadata.intentId || '';

        if (owner && amount) {
            await updateWallet({
                owner,
                amount: +amount,
                source: intentType,
                sourceId: intentId,
                currency: 'USD', // TODO multiple currency
            });
        }
    } catch (error) {
        log(`Error fullfilling stripe order`, error);
    }
};
