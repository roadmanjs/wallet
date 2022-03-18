import gql from 'graphql-tag';

export const TransactionFragment = gql`
    fragment TransactionFragment on Transaction {
        id
        createdAt
        updatedAt
        owner
        currency
        amount
        type
        status
        source
        sourceId
        currency
    }
`;

export const TransactionPaginationFragment = gql`
    fragment TransactionPaginationFragment on TransactionPagination {
        items {
            ...TransactionFragment
        }
        hasNext
        params
    }
    ${TransactionFragment}
`;
