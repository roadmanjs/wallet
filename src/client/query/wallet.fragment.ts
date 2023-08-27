import gql from 'graphql-tag';

export interface Wallet {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    currency: string;
    address: string;
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
        address
        amount
    }
`;

// TODO WalletPagination fragment when required
