import {TransactionPaginationFragment} from './transaction.fragment';
import gql from 'graphql-tag';

export const TRANSACTIONS_QUERY = gql`
    query Transactions(
        $filters: String
        $sort: String
        $before: DateTime
        $after: DateTime
        $limit: Float
    ) {
        transactions(
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
