import {Resolver, Query, Arg, UseMiddleware, Ctx} from 'type-graphql';
import _get from 'lodash/get';
import {log} from '@roadmanjs/logs';
import {ContextType, isAuth} from '@roadmanjs/auth';
import {Wallet} from './Wallet.model';
import {createFindWallet} from './Wallet.methods';

@Resolver()
export class WalletResolver {
    @Query(() => [Wallet])
    @UseMiddleware(isAuth)
    async myWallets(
        @Ctx() ctx: ContextType,
        @Arg('currency', () => [String], {nullable: true}) currencies: string[]
    ): Promise<Wallet[]> {
        const owner = _get(ctx, 'payload.userId', '');

        try {
            // fetch or create wallets using the provided currencies
            const wallets = await Promise.all(
                currencies.map((currency) => {
                    return createFindWallet({
                        owner,
                        currency,
                        create: true,
                    });
                })
            );

            return wallets;
        } catch (error) {
            log('error getting wallets', error);
            return [];
        }
    }
}

export default WalletResolver;
