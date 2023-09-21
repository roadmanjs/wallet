import {REDIS_URL, verbose} from 'roadman';
import {btcpayServerStore, btcpayServerToken, btcpayServerUrl} from '../btcpayserver.config';

import Redis from 'ioredis';
// generateAddress
// [cron] getAllTransactions -> settle
import axios from 'axios';
import {isEmpty} from 'lodash';

export class RatesCache {
    redis: Redis;
    constructor() {
        this.redis = new Redis(REDIS_URL);
    }

    async getPair(pair) {
        return new Promise((resolve) => {
            this.redis.get(pair, (err, result) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(JSON.parse(result));
                }
            });
        });
    }

    async savePair(pair, value: any) {
        return this.redis.set(pair, JSON.stringify(value));
    }
}

interface BtcpayserverRate {
    pair: string;
    rate: number;
    errors?: any[];
}

export const fetchRates = async (pairs: string, cache = false): Promise<BtcpayserverRate[]> => {
    try {
        if (cache) {
            const ratesCache = new RatesCache();
            const rates = await Promise.all(
                pairs.split(',').map((pair) => ratesCache.getPair(pair))
            );
            return rates as any;
        }

        const endpoint = `${btcpayServerUrl}/stores/${btcpayServerStore}/rates?currencyPair=${pairs
            .split(',')
            .join('&currencyPair=')}`;

        const {data} = await axios.get(endpoint, {
            headers: {
                Authorization: `token ${btcpayServerToken}`,
            },
        });

        return data.map((rate) => ({
            pair: rate.currencyPair,
            rate: +rate.rate,
        }));
    } catch (error) {
        console.log('Error getting store rates:', error);
        return [];
    }
};

export const fetchRatesSaveToCache = async (pairs: string): Promise<any> => {
    try {
        const cache = new RatesCache();
        const rates = await fetchRates(pairs);
        if (!isEmpty(rates)) {
            const savedPairs = await rates.map(async (rate) => cache.savePair(rate.pair, rate));
            verbose('savedPairs', savedPairs.length);
        }
    } catch (error) {
        console.log('error fetchRatesSaveToCache', error);
        return null;
    }
};
