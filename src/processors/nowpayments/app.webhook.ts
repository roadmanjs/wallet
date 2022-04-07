import type {ICreateInvoice, ICreatePayment} from '@nowpaymentsio/nowpayments-api-js/src/types';
import {
    createNowPayment,
    createNowPaymentInvoice,
    fulfillNowPayment,
    getPaymentStatus,
} from './nowpayments.methods';
import express, {Router} from 'express';
import {nowPaymentsCallbackUrl, nowPaymentsSecretIPN} from './config';

import type {GetPaymentStatusReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/get-payment-status';
import crypto from 'crypto';
import isEmpty from 'lodash/isEmpty';
import {log} from '@roadmanjs/logs';
import {v4 as uuidv4} from 'uuid';

export const nowpaymentsExpressify = (): Router => {
    const app = express.Router();

    app.get('/ping', async (req, res) => {
        log('now');
        res.json({nowpayments: 'now'});
    });

    // /status?id=blaseblase
    app.get('/status', async (req, res) => {
        try {
            const payId = req.query.id;
            log('status', payId);

            if (isEmpty(payId)) {
                throw new Error('payment id cannot be empty');
            }

            const paymentStatus = await getPaymentStatus(payId as string);
            return res.json(paymentStatus);
        } catch (error) {
            return res.json({error: error && error.message});
        }
    });

    // for any custom UI, e.g popup with returned info
    app.post('/createpayment', async (req, res) => {
        // TODO verify body
        const {
            owner,
            price_amount = 10,
            price_currency,
            pay_currency = price_currency,
            ipn_callback_url = nowPaymentsCallbackUrl,
            order_id = `${owner}-${uuidv4()}`,
            order_description = `${order_id}-Payment`,
            // TODO add other params if require
            ...otherArgs
        } = req.body || {};

        const createPayment: ICreatePayment = {
            price_amount,
            price_currency,
            pay_currency,
            ipn_callback_url,
            order_id,
            order_description,
            ...otherArgs,
        };

        log('createpayment', {createPayment, owner});

        try {
            const {payment, transaction} = await createNowPayment(createPayment, owner);
            return res.json({payment, transaction});
        } catch (error) {
            res.json({error: error && error.message});
        }
    });

    // for stripe checkout flow
    app.post('/createinvoice', async (req, res) => {
        // TODO verify body
        const {
            owner,
            price_amount = 10,
            price_currency,
            ipn_callback_url = nowPaymentsCallbackUrl,
            order_id = `${owner}-${uuidv4()}`,
            order_description = `${order_id}-Payment`,
            success_url,
            cancel_url,
            ...otherArgs
        } = req.body || {};

        const createInvoice: ICreateInvoice = {
            price_amount,
            price_currency,
            ipn_callback_url,
            order_id,
            order_description,
            success_url,
            cancel_url,
            ...otherArgs,
        };

        log('createinvoice', {createInvoice, owner});

        try {
            const {invoice, transaction} = await createNowPaymentInvoice(createInvoice, owner);
            return res.json({invoice, transaction});
        } catch (error) {
            res.json({error: error && error.message});
        }
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
