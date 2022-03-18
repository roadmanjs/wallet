import {WalletFragment} from '../WALLET_FRAGMENT';
import gql from 'graphql-tag';

export const MY_WALLET_QUERY = gql`
    query MyWallets($currency: [String]) {
        myWallets(currency: $currency) {
            ...WalletFragment
        }
    }
    ${WalletFragment}
`;
