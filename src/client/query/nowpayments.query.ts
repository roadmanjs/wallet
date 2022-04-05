import gql from 'graphql-tag';

export const NOWPAYMENTS_CREATE_INVOICE = gql`
    query NowPaymentsCreateInvoice(
        $amount: Float!
        $currency: String
        $order_description: String
        $success_url: String
        $cancel_url: String;
    ) {
        nowPaymentsCreateInvoice(amount: $amount, currency: $currency, order_description: $order_description, success_url: $success_url, cancel_url: $cancel_url)
    }
`;
