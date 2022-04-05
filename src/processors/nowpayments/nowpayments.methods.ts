import type {
    Error,
    ICreateInvoice,
    ICreatePayment,
} from '@nowpaymentsio/nowpayments-api-js/src/types';

import type {CreatePaymentReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/create-payment';
import type {InvoiceReturn} from '@nowpaymentsio/nowpayments-api-js/src/actions/create-invoice';
import NowPaymentsApi from '@nowpaymentsio/nowpayments-api-js';
import {nowPaymentsKey} from './config';

export const createNowPayment = async (
    payment: ICreatePayment
): Promise<CreatePaymentReturn | Error> => {
    const api = new NowPaymentsApi({apiKey: nowPaymentsKey}); // your api key
    return await api.createPayment(payment);
};

export const createNowPaymentInvoice = async (
    invoice: ICreateInvoice
): Promise<InvoiceReturn | Error> => {
    const api = new NowPaymentsApi({apiKey: nowPaymentsKey}); // your api key
    return await api.createInvoice(invoice);
};
