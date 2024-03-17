import 'dotenv/config';

import _get from 'lodash/get';

export const btcpayServerToken = _get(process.env, 'BTCPAYSERVER_TOKEN', '');
export const btcpayServerUrl = _get(process.env, 'BTCPAYSERVER_URL', '');
export const btcpayServerStore = _get(process.env, 'BTCPAYSERVER_STORE', '');
export const btcpayServerBtcWalletId = _get(process.env, 'BTCPAYSERVER_BTC', '');
export const btcpayServerXmrWalletId = _get(process.env, 'BTCPAYSERVER_XMR', '');
export const btcpayServerCron = _get(process.env, 'BTCPAYSERVER_CRON', '*/5 * * * *');
export const btcpayServerCronRates = _get(process.env, 'BTCPAYSERVER_CRON_RATES', '*/1 * * * *');
export const btcpayServerCronEnabled = _get(process.env, 'BTCPAYSERVER_CRON_ENABLED', '');

// BTCPAYSERVER_CRON_ENABLED=btc,xmr
// BTCPAYSERVER_CRON=* * * * 0/5
export const wallets = {
    btc: btcpayServerBtcWalletId,
    xmr: btcpayServerXmrWalletId,
};
