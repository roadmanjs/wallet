import {TransactionPAGE} from '../TRANSACTION_PAGE';
import gql from 'graphql-tag';

export const TRANSACTIONS_BY_TIME = gql`
    query TransactionsByTime(
        $filter: String
        $sort: String
        $before: DateTime
        $after: DateTime
        $limit: Float
    ) {
        transactionsByTime(
            filter: $filter
            sort: $sort
            before: $before
            after: $after
            limit: $limit
        ) {
            ...TransactionPAGE
        }
    }
    ${TransactionPAGE}
`;
