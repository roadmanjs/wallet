import gql from 'graphql-tag';

export const FETCH_RATES_QUERY = gql`
    query FetchRates($currencyPair: String!) {
        data: fetchRates(currencyPair: $currencyPair) {
            currencyPair
            rate
        }
    }
`;
