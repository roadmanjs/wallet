import {TransactionFragment, TransactionPaginationFragment} from './transaction.fragment';

import gql from 'graphql-tag';

export const TRANSACTIONS_QUERY = gql`
    query Transactions(
        $filters: String
        $sort: String
        $before: DateTime
        $after: DateTime
        $limit: Float
    ) {
        data: transactions(
            filters: $filters
            sort: $sort
            before: $before
            after: $after
            limit: $limit
        ) {
            ...TransactionPaginationFragment
        }
    }
    ${TransactionPaginationFragment}
`;

export const TRANSACTIONS_GET_QUERY = gql`
    query Transactions($owner: String, $id: String!) {
        data: transactionGet(id: $id, owner: $owner) {
            ...TransactionFragment
        }
    }
    ${TransactionFragment}
`;
