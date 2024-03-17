import 'dotenv/config';

import _get from 'lodash/get';

export const moneroxCron = _get(process.env, 'MONEROX_CRON', '*/5 * * * *');
export const moneroxUrl = _get(process.env, 'MONEROX_URL', '');
export const moneroxWallet = _get(process.env, 'MONEROX_WALLET', '');
