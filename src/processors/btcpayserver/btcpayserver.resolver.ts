import {Resolver, Query, Arg, UseMiddleware} from 'type-graphql';
import {log} from '@roadmanjs/logs';
import {isAuth} from '@roadmanjs/auth';
import {ObjectType, Field} from 'couchset';
import {fetchRates} from './rates';

@ObjectType()
export class PairRate {
    @Field(() => String, {nullable: true})
    pair = '';

    @Field(() => Number, {nullable: true})
    rate = 0;
}

@Resolver()
export class BtcpayserverResolver {
    @Query(() => [PairRate])
    @UseMiddleware(isAuth)
    async fetchRates(
        @Arg('pairs', () => String, {
            nullable: false,
            description: 'e.g BTC_USD,BTC_EUR The currency pairs to fetch rates for',
        })
        currencyPair: string
    ): Promise<PairRate[]> {
        try {
            return await fetchRates(currencyPair, true);
        } catch (error) {
            log('error fetching rates for ' + currencyPair, error);
            return [];
        }
    }
}

export default BtcpayserverResolver;
