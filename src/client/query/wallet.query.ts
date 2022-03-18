import {WalletFragment} from './wallet.fragment';
import gql from 'graphql-tag';

// Manually define fragments
// TODO cannot re-use automatic with manual
// TODO automatic works on it's own

export const MY_WALLET_QUERY = gql`
    query MyWallets($currency: [String!]) {
        myWallets(currency: $currency) {
            ...WalletFragment
        }
    }
    ${WalletFragment}
`;
