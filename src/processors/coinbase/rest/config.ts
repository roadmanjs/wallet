import 'dotenv/config';

import _get from 'lodash/get';

export const coinbaseAddress = _get(process.env, 'COINBASE_ADDRESS', ''); // support only one
export const coinbaseSecret = _get(process.env, 'COINBASE_SECRET', '');
export const coinbaseKey = _get(process.env, 'COINBASE_KEY', '');
