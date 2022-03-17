import 'dotenv/config';

import _get from 'lodash/get';

export const paymentProcessorDescription = _get(process.env, 'PAYMENT_DESC', '');
export const stripeSecret = _get(process.env, 'STRIPE_SECRET', '');
export const stripeEndpointSecret = _get(process.env, 'STRIPE_ENDPOINT_SECRET', '');
