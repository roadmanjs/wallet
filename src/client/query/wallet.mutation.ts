import {ResTypeFragment} from 'couchset';
import gql from 'graphql-tag';

export const GENERATE_WALLET_ADDRESS_MUTATION = gql`
    mutation GetWalletAddress($currency: String!, $forceGenerate: Boolean) {
        data: getWalletAddress(currency: $currency, forceGenerate: $forceGenerate) {
            ...ResTypeFragment
        }
    }
    ${ResTypeFragment}
`;
