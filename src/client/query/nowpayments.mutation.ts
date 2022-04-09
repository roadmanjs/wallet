import {NowPaymentsCreatePaymentFragment} from './nowpayments.fragment';
import {TransactionFragment} from './transaction.fragment';
import gql from 'graphql-tag';

export const NOWPAYMENTS_CREATE_PAYMENT = gql`
    mutation NowPaymentsCreatePayment($amount: Float!, $order_description: String) {
        nowPaymentsCreatePayment(amount: $amount, order_description: $order_description) {
            payment {
                ...NowPaymentsCreatePaymentFragment
            }
            transaction {
                ...TransactionFragment
            }
        }
    }
    ${TransactionFragment}
    ${NowPaymentsCreatePaymentFragment}
`;
