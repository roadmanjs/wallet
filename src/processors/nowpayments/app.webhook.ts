import express, {Router} from 'express';

import type {GetPaymentStatusReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/get-payment-status';
import crypto from 'crypto';
import {fulfillNowPayment} from './nowpayments.methods';
import {log} from '@roadmanjs/logs';
import {nowPaymentsSecretIPN} from './config';

export const nowpaymentsExpressify = (): Router => {
    const app = express.Router();

    // TODO to delete
    app.get('/ping', async (req, res) => {
        log('now');
        res.json({stripe: 'now'});
    });

    /**
     * Full endpoint
     */
    app.post('/webhook', async (request: any, response: any) => {
        const payload: GetPaymentStatusReturn = request.body;

        const signatureFromHeader = request.headers['x-nowpayments-sig'];

        try {
            // TODO needs to be tested
            const hmac = crypto.createHmac('sha512', nowPaymentsSecretIPN);
            hmac.update(JSON.stringify(payload, Object.keys(payload).sort()));
            const signedSignature = hmac.digest('hex');

            if (signatureFromHeader !== signedSignature) {
                throw new Error('Signature does not match like from Nowpayments');
            }
        } catch (err) {
            // catchError(err);
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }

        switch (payload.payment_status) {
            case 'success': {
                await fulfillNowPayment(payload);
                // TODO fullfill payment
                break;
            }
            // todo canceled
        }

        // Return a response to acknowledge receipt of the event
        response.json({received: true});
    });

    return app;
};
