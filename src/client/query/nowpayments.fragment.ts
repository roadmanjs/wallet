import {Transaction} from './transaction.fragment';
import gql from 'graphql-tag';

export interface NowPaymentsCreatePayment {
    payment_id: number;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    order_id: string;
    order_description: string;
    ipn_callback_url: string;
    created_at: string;
    updated_at: string;
    purchase_id: number;
}

export const NowPaymentsCreatePaymentFragment = gql`
    fragment NowPaymentsCreatePaymentFragment on NowPaymentsCreatePayment {
        payment_id
        payment_status
        pay_address
        price_amount
        price_currency
        pay_amount
        pay_currency
        order_id
        order_description
        ipn_callback_url
        created_at
        updated_at
        purchase_id
    }
`;

export interface NowPaymentsGetPaymentStatus {
    payment_id: number;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    actually_paid: number;
    pay_currency: string;
    order_id: string;
    order_description: string;
    purchase_id: number;
    created_at: string;
    updated_at: string;
    outcome_amount: number;
    outcome_currency: string;
}

export const NowPaymentsGetPaymentStatusFragment = gql`
    fragment NowPaymentsGetPaymentStatusFragment on NowPaymentsGetPaymentStatus {
        payment_id
        payment_status
        pay_address
        price_amount
        price_currency
        pay_amount
        actually_paid
        pay_currency
        order_id
        order_description
        purchase_id
        created_at
        updated_at
        outcome_amount
        outcome_currency
    }
`;

export interface NowPaymentsGetPaymentResponse {
    payment: NowPaymentsGetPaymentStatus;
    transaction: Transaction;
}

export interface NowPaymentsCreatePaymentResponse {
    payment: NowPaymentsGetPaymentStatus;
    transaction: Transaction;
}
