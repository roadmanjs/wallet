import {WalletOutputFragment} from './wallet.fragment';
import gql from 'graphql-tag';

export const MY_WALLET_QUERY = gql`
    query MyWallets($currency: [String!], $createNew: Boolean) {
        data: myWallets(currency: $currency, createNew: $createNew) {
            ...WalletOutputFragment
        }
    }
    ${WalletOutputFragment}
`;
