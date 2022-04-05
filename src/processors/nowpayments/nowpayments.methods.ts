import type {
    Error,
    ICreateInvoice,
    ICreatePayment,
} from '@nowpaymentsio/nowpayments-api-js/src/types';
import {Transaction, TransactionModel} from '../../transactions';
import {log, verbose} from '@roadmanjs/logs';

import type {CreatePaymentReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/create-payment';
import type {GetPaymentStatusReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/get-payment-status';
import type {InvoiceReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/create-invoice';
import NowPaymentsApi from '@nowpaymentsio/nowpayments-api-js';
import {awaitTo} from 'couchset/dist/utils';
import isEmpty from 'lodash/isEmpty';
import {nowPaymentsKey} from './config';
import {updateWallet} from '../../wallet';

export const createNowPayment = async (
    payment: ICreatePayment
): Promise<CreatePaymentReturn | Error> => {
    const api = new NowPaymentsApi({apiKey: nowPaymentsKey}); // your api key
    return await api.createPayment(payment);
};

export const createNowPaymentInvoice = async (invoice: ICreateInvoice): Promise<InvoiceReturn> => {
    const api = new NowPaymentsApi({apiKey: nowPaymentsKey}); // your api key
    return (await api.createInvoice(invoice)) as InvoiceReturn;
};

export const findNowPaymentTransaction = async (sourceId: string): Promise<Transaction> => {
    try {
        const transaction = await TransactionModel.pagination({
            select: '*',
            where: {
                sourceId,
            },
        });

        if (!isEmpty(transaction)) {
            return transaction[0]; // return the first one
        }

        throw new Error('Transaction not found');
    } catch (error) {
        log('error finding nowpayments transaction');
        return null;
    }
};

export const fulfillNowPayment = async (
    paymentStatusData: GetPaymentStatusReturn
): Promise<void> => {
    verbose('Fulfilling paymentStatusData', paymentStatusData);

    try {
        const {pay_amount: amount, order_id: sourceId = ''} = paymentStatusData;
        const owner = sourceId.split('-')[0]; // is like userId-somestring;

        if (amount) {
            // find the waiting transaction and delete it
            // if waiting transaction does not exist, then this is a duplicate notification

            const [errorWaitingTransaction, waitingTransaction] = await awaitTo(
                findNowPaymentTransaction(sourceId)
            );

            if (errorWaitingTransaction) {
                throw errorWaitingTransaction;
            }

            await TransactionModel.delete(waitingTransaction.id); // delete the waiting transaction

            // this creates a new transaction
            await updateWallet({
                owner,
                amount: +amount,
                source: 'nowpayments',
                sourceId,
                currency: 'USD',
            });
        }
    } catch (error) {
        log(`Error fullfilling nowpayment order`, error);
    }
};
