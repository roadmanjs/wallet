import {UserType} from '@roadmanjs/auth-client';
import gql from 'graphql-tag';
export interface WalletAddress {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    owner?: string;
    currency?: string;
    transactions?: number;
}
export interface Wallet {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    owner: UserType | string;
    address?: WalletAddress | string;
    currency?: string;
    amount?: number;
}

export interface WalletOutput extends Wallet {
    owner: UserType;
    address?: WalletAddress;
}

export interface WalletPagination {
    items?: Wallet[];
    hasNext?: boolean;
    params?: object;
}

export const WalletAddressFragment = gql`
    fragment WalletAddressFragment on WalletAddress {
        id
        createdAt
        updatedAt
        transactions
        currency
    }
`;

export const WalletOutputFragment = gql`
    fragment WalletOutputFragment on WalletOutput {
        id
        createdAt
        updatedAt
        owner {
            id
        }
        currency
        address {
            ...WalletAddressFragment
        }
        amount
    }
    ${WalletAddressFragment}
`;

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
