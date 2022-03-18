import gql from 'graphql-tag';

export interface Wallet {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    currency: string;
    amount: number;
}

export interface WalletPagination {
    items?: Wallet[];
    hasNext?: boolean;
    params?: object;
}

export const WalletFragment = gql`
    fragment WalletFragment on Wallet {
        id
        createdAt
        updatedAt
        owner
        currency
        amount
    }
`;

// TODO WalletPagination fragment when required
