import {Resolver, Query, Arg, UseMiddleware, Ctx, ObjectType, Field} from 'couchset';
import {v4 as uuidv4} from 'uuid';
import _get from 'lodash/get';
import {log} from '@roadmanjs/logs';
import type {ICreateInvoice} from '@nowpaymentsio/nowpayments-api-js/src/types';
import {isAuth, ContextType} from '@roadmanjs/auth';
import {Transaction} from '../../transactions';
import {nowPaymentsCallbackUrl} from './config';
import {createNowPaymentInvoice, getPaymentStatus} from './nowpayments.methods';
import isEmpty from 'lodash/isEmpty';

@ObjectType()
class GetPaymentStatus {
    @Field(() => Number, {nullable: true})
    payment_id: number;
    @Field(() => String, {nullable: true})
    payment_status: string;
    @Field(() => String, {nullable: true})
    pay_address: string;
    @Field(() => Number, {nullable: true})
    price_amount: number;
    @Field(() => String, {nullable: true})
    price_currency: string;
    @Field(() => Number, {nullable: true})
    pay_amount: number;
    @Field(() => Number, {nullable: true})
    actually_paid: number;
    @Field(() => String, {nullable: true})
    pay_currency: string;
    @Field(() => String, {nullable: true})
    order_id: string;
    @Field(() => String, {nullable: true})
    order_description: string;
    @Field(() => Number, {nullable: true})
    purchase_id: number;
    @Field(() => String, {nullable: true})
    created_at: string;
    @Field(() => String, {nullable: true})
    updated_at: string;
    @Field(() => Number, {nullable: true})
    outcome_amount: number;
    @Field(() => String, {nullable: true})
    outcome_currency: string;
}

@Resolver()
export class NowPaymentsResolver {
    @Query(() => [Transaction])
    @UseMiddleware(isAuth)
    async nowPaymentsCreateInvoice(
        @Ctx() ctx: ContextType,
        @Arg('amount', () => Number, {nullable: false}) payAmount: number,
        @Arg('currency', () => String, {nullable: true}) priceCurrency: string,
        @Arg('order_description', () => String, {nullable: true}) orderDescription: string,
        @Arg('success_url', () => String, {nullable: true}) successUrl: string,
        @Arg('cancel_url', () => String, {nullable: true}) cancelUrl: string
    ): Promise<String> {
        const owner = _get(ctx, 'payload.userId', '');
        const price_currency = priceCurrency || 'usd';
        const order_id = `${owner}-${uuidv4()}`;
        const order_description = orderDescription || `${order_id}-Payment`;

        try {
            const createInvoice: ICreateInvoice = {
                price_amount: payAmount,
                price_currency,
                ipn_callback_url: nowPaymentsCallbackUrl,
                order_id,
                order_description,
                success_url: successUrl,
                cancel_url: cancelUrl,
            };

            const {invoice: nowPaymentInvoiceCreated} = await createNowPaymentInvoice(
                createInvoice,
                owner
            );

            return nowPaymentInvoiceCreated.invoice_url;
        } catch (error) {
            log('error creating nowpayment invoice', error);
            return null;
        }
    }

    @Query(() => [GetPaymentStatus])
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
