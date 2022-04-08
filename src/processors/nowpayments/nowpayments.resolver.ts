import {Resolver, Query, Arg, UseMiddleware, Ctx, Mutation} from 'couchset';
import {v4 as uuidv4} from 'uuid';
import _get from 'lodash/get';
import {log} from '@roadmanjs/logs';
import type {ICreatePayment} from '@nowpaymentsio/nowpayments-api-js/src/types';
import {isAuth, ContextType} from '@roadmanjs/auth';
import {nowPaymentsCallbackUrl, nowPaymentsPayCurrency} from './config';
import {createNowPayment, getPaymentStatus} from './nowpayments.methods';
import isEmpty from 'lodash/isEmpty';
import {CreatePaymentResponse, GetPaymentStatus} from './nowpayments.modal';

@Resolver()
export class NowPaymentsResolver {
    // @Mutation(() => String) // todo return invoice and transaction
    // @UseMiddleware(isAuth)
    // async nowPaymentsCreateInvoice(
    //     @Ctx() ctx: ContextType,
    //     @Arg('amount', () => Number, {nullable: false}) payAmount: number,
    //     @Arg('currency', () => String, {nullable: true}) priceCurrency: string,
    //     @Arg('order_description', () => String, {nullable: true}) orderDescription: string,
    //     @Arg('success_url', () => String, {nullable: true}) successUrl: string,
    //     @Arg('cancel_url', () => String, {nullable: true}) cancelUrl: string
    // ): Promise<String> {
    //     const owner = _get(ctx, 'payload.userId', '');
    //     const price_currency = priceCurrency || 'usd';
    //     const order_id = `${owner}-${uuidv4()}`;
    //     const order_description = orderDescription || `${order_id}-Payment`;

    //     try {
    //         const createInvoice: ICreateInvoice = {
    //             price_amount: payAmount,
    //             price_currency,
    //             ipn_callback_url: nowPaymentsCallbackUrl,
    //             order_id,
    //             order_description,
    //             success_url: successUrl,
    //             cancel_url: cancelUrl,
    //         };

    //         const {invoice: nowPaymentInvoiceCreated} = await createNowPaymentInvoice(
    //             createInvoice,
    //             owner
    //         );

    //         return nowPaymentInvoiceCreated.invoice_url;
    //     } catch (error) {
    //         log('error creating nowpayment invoice', error);
    //         return null;
    //     }
    // }

    @Mutation(() => CreatePaymentResponse)
    @UseMiddleware(isAuth)
    async nowPaymentsCreatePayment(
        @Ctx() ctx: ContextType,
        @Arg('amount', () => Number, {nullable: false}) payAmount: number,
        @Arg('order_description', () => String, {nullable: true}) orderDescription: string
    ): Promise<CreatePaymentResponse> {
        const owner = _get(ctx, 'payload.userId', '');
        const price_currency = 'usd'; // by default
        const order_id = `${owner}-${uuidv4()}`;
        const order_description = orderDescription || `${order_id}-Payment`;

        try {
            const createPayment: ICreatePayment = {
                price_amount: payAmount,
                price_currency,
                pay_currency: nowPaymentsPayCurrency,
                ipn_callback_url: nowPaymentsCallbackUrl,
                order_id,
                order_description,
            };

            const paymentAndTransaction = await createNowPayment(createPayment, owner);

            return paymentAndTransaction;
        } catch (error) {
            log('error creating nowpayment invoice', error);
            return null;
        }
    }

    @Query(() => GetPaymentStatus)
    @UseMiddleware(isAuth)
    async nowPaymentsStatus(
        @Arg('id', () => String, {nullable: false}) payId: string
    ): Promise<GetPaymentStatus> {
        try {
            log('nowPaymentsStatus', payId);

            if (isEmpty(payId)) {
                throw new Error('payment id cannot be empty');
            }

            const paymentStatus = await getPaymentStatus(payId);
            return paymentStatus;
        } catch (error) {
            log('error getting payment status', error);
            return null;
        }
    }

    // todo nowPaymentsCreatePayment
}

export default NowPaymentsResolver;
