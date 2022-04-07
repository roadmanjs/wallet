import 'dotenv/config';

import _get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export const nowPaymentsSandbox = _get(process.env, 'NOWPAYMENTS_SANDBOX', '');
export const nowPaymentsKey = _get(process.env, 'NOWPAYMENTS_KEY', '');
export const nowPaymentsSecretIPN = _get(process.env, 'NOWPAYMENTS_SECRET_IPN', '');
export const nowPaymentsCallbackUrl = _get(process.env, 'NOWPAYMENTS_CALLBACK_URL', '');
export const isNowPaymentsSandbox = !isEmpty(nowPaymentsSandbox);
