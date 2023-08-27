import {UserType} from '@roadmanjs/auth';
import {WalletAddress} from '../../wallet';
import gql from 'graphql-tag';

export interface Wallet {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: string | UserType;
    currency: string;
    address: string | WalletAddress;
    amount: number;
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
