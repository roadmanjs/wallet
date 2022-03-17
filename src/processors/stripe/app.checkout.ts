import express, {Router} from 'express';
import nodestripe, {Stripe} from 'stripe';

import {StripeResponseWebhook} from './response.interface';
import {log} from '@roadmanjs/logs';
import {paymentProcessorDescription} from './config';

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/account/apikeys

/**
 * TODO add multiple currencies passed via roadman args
 * HTTP STRIPE
 * @returns
 */
export const expressifyStripe = (): Router => {
    const stripe: Stripe = nodestripe(process.env.STRIPE_SECRET);

    // Find your endpoint's secret in your Dashboard's webhook settings
    const endpointSecret: any = process.env.STRIPE_ENDPOINT_SECRET;

    const app = express.Router();
    /**
     * Create checkout session
     */
    app.post('/session', async (req, res) => {
        const host = req.body.host;
        const path = req.body.path;
        const owner = req.body.userId;
        const amount = req.body.amount || 1;
        const intentQuery: string = req.body.intentQuery || '';
        const productIntent = req.body.intent || {};
        const amountPlusCents = Math.round(+amount * 100);

        console.log('Body from session', JSON.stringify(req.body));

        if (!host) {
            res.json({error: 'Please try again'});
            return;
        }

        const session = await stripe.checkout.sessions.create({
            metadata: {owner, amount, ...productIntent},
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: paymentProcessorDescription,
                        },
                        unit_amount: amountPlusCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${host}${path}?success=true&stripe_session_id={CHECKOUT_SESSION_ID}&${intentQuery}`,
            cancel_url: `${host}${path}?failed=true&stripe_session_id={CHECKOUT_SESSION_ID}&${intentQuery}`,
        });

        res.json({id: session.id});
    });

    /**
     * Full endpoint stripe
     */
    app.post('/webhook', async (request: any, response: any) => {
        const payload = request.body;
        const sig = request.headers['stripe-signature'];

        log('sig = ' + JSON.stringify(sig));
        log('endpointSecret = ' + endpointSecret);
        log('webhook = ' + JSON.stringify(payload));

        // logAmplitudeEvent(payload);

        let event: StripeResponseWebhook = payload;

        try {
            event = (await stripe.webhooks.constructEvent(
                request.body,
                sig,
                endpointSecret
            )) as any;
        } catch (err) {
            // catchError(err);
            return response.status(400).send(`Webhook Error: ${err.message}`);
        }

        const session = event.data.object;

        // log event to amplitude
        // logAmplitudeEvent(session);

        switch (event.type) {
            case 'checkout.session.completed': {
                // Save an order in your database, marked as 'awaiting payment'
                // createOrder(session);

                // Check if the order is paid (e.g., from a card payment)
                //
                // A delayed notification payment will have an `unpaid` status, as
                // you're still waiting for funds to be transferred from the customer's
                // account.
                if (session.payment_status === 'paid') {
                    // addToPaymentQueue(session);
                }

                break;
            }

            case 'checkout.session.async_payment_succeeded': {
                // const session = event.data.object;

                // Fulfill the purchase...
                // addToPaymentQueue(session);

                break;
            }

            case 'checkout.session.async_payment_failed': {
                // const session = event.data.object;
                // TODO tell client transaction failed

                // Send an email to the customer asking them to retry their order
                // emailCustomerAboutFailedPayment(session);

                break;
            }
        }

        // Return a response to acknowledge receipt of the event
        response.json({received: true});
    });

    return app;
};
