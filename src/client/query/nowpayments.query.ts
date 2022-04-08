import {NowPaymentsGetPaymentStatusFragment} from './nowpayments.fragment';
import {TransactionFragment} from './transaction.fragment';
import gql from 'graphql-tag';

export const NOWPAYMENTS_GET_STATUS = gql`
    query NowPaymentsGetStatus($id: String!) {
        nowPaymentsGetStatus(id: $id) {
            payment {
                ...NowPaymentsGetPaymentStatusFragment
            }
            transaction {
                ...TransactionFragment
            }
        }
    }
    ${TransactionFragment}
    ${NowPaymentsGetPaymentStatusFragment}
`;
