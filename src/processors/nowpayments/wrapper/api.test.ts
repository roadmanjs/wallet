import 'mocha';

import {isNowPaymentsSandbox, nowPaymentsKey} from '../config';

import NowApi from './api';
import {expect} from 'chai';

const api = new NowApi({apiKey: nowPaymentsKey, sandbox: isNowPaymentsSandbox});

describe('NowPayments', () => {
    it('it should create a demo payment', async () => {
        
        const demoPayment = {
            // owner: '',
            // case: 'success',
            price_amount: 3999.5,
            price_currency: 'usd',
            pay_amount: 0.8102725,
            pay_currency: 'btc',
            ipn_callback_url: 'https://nowpayments.io',
            order_id: 'RGDBP-21314 2',
            order_description: 'Apple Macbook Pro 2019 x 2',
        };

        const createPayment = await api.createPayment(demoPayment);

        console.log("created payment", createPayment);
        
        expect(createPayment.order_id).not.to.be.null;
    });
});
