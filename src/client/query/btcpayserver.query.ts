import gql from 'graphql-tag';

export interface BtcpayserverRate {
    pair: string;
    rate: number;
}

export const FETCH_RATES_QUERY = gql`
    query FetchRates($pairs: String!) {
        data: fetchRates(pairs: $pairs) {
            pair
            rate
        }
    }
`;
