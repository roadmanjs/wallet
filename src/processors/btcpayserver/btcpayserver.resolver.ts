import {Resolver, Query, Arg, UseMiddleware} from 'type-graphql';
import {log} from '@roadmanjs/logs';
import {isAuth} from '@roadmanjs/auth';
import {ObjectType, Field} from 'couchset';
import {fetchRates} from './btcpayserver';

@ObjectType()
export class BtcpayserverRates {
    @Field(() => String, {nullable: true})
    pair = '';

    @Field(() => Number, {nullable: true})
    rate = 0;
}

@Resolver()
export class BtcpayserverResolver {
    @Query(() => [BtcpayserverRates])
    @UseMiddleware(isAuth)
    // TODO: add a way to fetch multiple currency pairs
    async fetchRates(
        @Arg('pairs', () => String, {
            nullable: false,
            description: 'e.g BTC_USD,BTC_EUR The currency pairs to fetch rates for',
        })
        currencyPair: string
    ): Promise<BtcpayserverRates[]> {
        try {
            return await fetchRates(currencyPair);
        } catch (error) {
            log('error fetching rates for ' + currencyPair, error);
            return [];
        }
    }
}

export default BtcpayserverResolver;