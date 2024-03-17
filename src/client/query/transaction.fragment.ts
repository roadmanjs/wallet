import gql from 'graphql-tag';
export interface Transaction {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    type: string;
    status: string;
    source: string;
    sourceId: string;
    currency: string;
    amount: number;
    transactionHash?: string;
    feePerc?: number;
}

export interface TransactionPagination {
    items?: Transaction[];
    hasNext?: boolean;
    params?: object;
}

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
        transactionHash
        feePerc
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
