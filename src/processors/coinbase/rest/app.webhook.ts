import express, {Router} from 'express';

import {CoinbaseNotification} from './interface';
import {log} from '@roadmanjs/logs';

export const coinbaseWebhook = (): Router => {
    const app = express.Router();

    // TODO to delete
    app.get('/ping', async (req, res) => {
        log('stripe');
        res.json({stripe: 'stripe'});
    });

    /**
     * Full endpoint
     */
    app.post('/webhook', async (request: any, response: any) => {
        const payload: CoinbaseNotification = request.body;

        // TODO webhook verification
        // const sig = request.headers['stripe-signature'];
        // log('sig = ' + JSON.stringify(sig));
        // log('endpointSecret = ' + endpointSecret);
        // log('webhook = ' + JSON.stringify(payload));

        // logAmplitudeEvent(payload);

        // try {
        //     event = (await stripe.webhooks.constructEvent(
        //         request.body,
        //         sig,
        //         endpointSecret
        //     )) as any;
        // } catch (err) {
        //     // catchError(err);
        //     return response.status(400).send(`Webhook Error: ${err.message}`);
        // }

        switch (payload.type) {
            case 'wallet:addresses:new-payment': {
                // TODO amounts and fullfull

                break;
            }
        }

        // Return a response to acknowledge receipt of the event
        response.json({received: true});
    });

    return app;
};
