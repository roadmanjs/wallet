import gql from 'graphql-tag';

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
