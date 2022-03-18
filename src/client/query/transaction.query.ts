import {TransactionPaginationFragment} from './transaction.fragment';
import gql from 'graphql-tag';

export const TRANSACTIONS_QUERY = gql`
    query Transactions(
        $filter: String
        $sort: String
        $before: DateTime
        $after: DateTime
        $limit: Float
    ) {
        transactions(filter: $filter, sort: $sort, before: $before, after: $after, limit: $limit) {
            ...TransactionPaginationFragment
        }
    }
    ${TransactionPaginationFragment}
`;
