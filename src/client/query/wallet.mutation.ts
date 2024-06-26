import {WalletResTypeFragment} from './resType';
import gql from 'graphql-tag';

export const GENERATE_WALLET_ADDRESS_MUTATION = gql`
    mutation GetWalletAddress($currency: String!, $forceGenerate: Boolean) {
        data: getWalletAddress(currency: $currency, forceGenerate: $forceGenerate) {
            ...WalletResTypeFragment
        }
    }
    ${WalletResTypeFragment}
`;
