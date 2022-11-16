import 'mocha';

import {expect} from 'chai';
import nodestripe from 'stripe';

describe('Stripe checkout', () => {
    it('it should mock webhook', () => {
        // @ts-ignore
        const stripe = nodestripe(process.env.STRIPE_SECRET);

        const payload = {
            id: 'evt_test_webhook',
            object: 'event',
        };

        const payloadString = JSON.stringify(payload, null, 2);
        const secret = 'whsec_test_secret';

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        const event = stripe.webhooks.constructEvent(payloadString, header, secret);

        // Do something with mocked signed event
        expect(event.id).to.equal(payload.id);
    });
});
