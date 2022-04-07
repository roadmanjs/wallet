import type {
    Error,
    ICreateInvoice,
    ICreatePayment,
} from '@nowpaymentsio/nowpayments-api-js/src/types';
import {Transaction, TransactionModel} from '../../transactions';
import {isNowPaymentsSandbox, nowPaymentsKey} from './config';
import {log, verbose} from '@roadmanjs/logs';

import type {CreatePaymentReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/create-payment';
import type {GetPaymentStatusReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/get-payment-status';
import type {InvoiceReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/create-invoice';
import NowApi from './wrapper/api';
// import NowPaymentsApi from '@nowpaymentsio/nowpayments-api-js';
import {awaitTo} from 'couchset/dist/utils';
import isEmpty from 'lodash/isEmpty';
import {updateWallet} from '../../wallet';

const sandbox = isNowPaymentsSandbox;

/**
 * Get the payment status
 * @param id
 * @returns
 */
export const getPaymentStatus = async (id: string): Promise<GetPaymentStatusReturn> => {
    const api = new NowApi({apiKey: nowPaymentsKey, sandbox}); // your api key
    return await api.getStatus(id);
};

/**
 * Create a now payment
 * @param payment
 * @param owner
 * @returns
 */
export const createNowPayment = async (
    payment: ICreatePayment,
    owner: string
): Promise<{payment: CreatePaymentReturn; transaction: Transaction}> => {
    try {
        const api = new NowApi({apiKey: nowPaymentsKey, sandbox}); // your api key
        const [nowPaymentError, nowPaymentCreated] = await awaitTo(api.createPayment(payment));

        if (nowPaymentError) {
            throw nowPaymentError;
        }

        log(`createNowPayment created ${JSON.stringify(nowPaymentCreated)}`);

        // create a transaction
        const newTransaction: Transaction = {
            type: 'deposit',
            owner,
            source: 'nowpayments',
            sourceId: `${nowPaymentCreated.payment_id}`, // for checking status from client
            status: 'waiting',
            amount: payment.price_amount,
            currency: payment.price_currency,
        };

        const createTransaction = await TransactionModel.create(newTransaction); // save transaction
        log(`newTransaction created ${JSON.stringify(createTransaction)}`);
        return {transaction: createTransaction, payment: nowPaymentCreated as CreatePaymentReturn};
    } catch (error) {
        log(`error createNowPayment ${error && error.message}`);
        return null;
    }
};

/**
 * Creates a nowpayment invoice invoice
 * @param invoice
 * @param owner
 * @returns
 */
export const createNowPaymentInvoice = async (
    invoice: ICreateInvoice,
    owner: string
): Promise<{transaction: Transaction; invoice: InvoiceReturn}> => {
    try {
        const api = new NowApi({apiKey: nowPaymentsKey, sandbox}); // your api key
        const [nowInvoiceError, nowPaymentInvoiceCreated] = await awaitTo(
            api.createInvoice(invoice)
        );

        if (nowInvoiceError) {
            throw nowInvoiceError;
        }

        if (!nowPaymentInvoiceCreated.order_id) {
            throw new Error('error creating invoice');
        }

        log(`nowPaymentInvoiceCreated created ${JSON.stringify(nowPaymentInvoiceCreated)}`);

        // create a transaction
        const newTransaction: Transaction = {
            type: 'deposit',
            owner,
            source: 'nowpayments',
            sourceId: '' + nowPaymentInvoiceCreated.id, // for checking status from client
            status: 'waiting',
            amount: invoice.price_amount,
            currency: invoice.price_currency,
        };

        const createTransaction = await TransactionModel.create(newTransaction); // save transaction
        log(`newTransaction created ${JSON.stringify(createTransaction)}`);
        return {transaction: createTransaction, invoice: nowPaymentInvoiceCreated as InvoiceReturn};
    } catch (error) {
        log(`error createNowPaymentInvoice ${error && error.message}`);
        return null;
    }
};

export const findNowPaymentTransaction = async (sourceId: string): Promise<Transaction> => {
    try {
        const transactions = await TransactionModel.pagination({
            select: '*',
            where: {
                sourceId,
            },
        });

        if (!isEmpty(transactions)) {
            return transactions[0]; // return the first one
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

        if (amount) {
            // find the waiting transaction and delete it
            // if waiting transaction does not exist, then this is a duplicate notification

            const [errorWaitingTransaction, waitingTransaction] = await awaitTo(
                findNowPaymentTransaction(sourceId)
            );

            if (errorWaitingTransaction) {
                throw errorWaitingTransaction;
            }

            const owner = waitingTransaction.owner;

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
