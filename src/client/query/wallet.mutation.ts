import {WalletAddressFragment} from './wallet.fragment';
import gql from 'graphql-tag';

export const GENERATE_WALLET_ADDRESS_MUTATION = gql`
    mutation GetWalletAddress($currency: String!, $forceGenerate: Boolean) {
        getWalletAddress(currency: $currency, forceGenerate: $forceGenerate) {
            ...WalletAddressFragment
        }
    }
    ${WalletAddressFragment}
`;
