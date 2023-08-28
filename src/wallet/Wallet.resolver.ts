import {Resolver, Query, Arg, UseMiddleware, Ctx, Mutation} from 'type-graphql';
import _get from 'lodash/get';
import {log} from '@roadmanjs/logs';
import {ContextType, isAuth} from '@roadmanjs/auth';
import {WalletAddress, WalletAddressModel, WalletOutput} from './Wallet.model';
import {createFindWallet, createWalletAddress} from './Wallet.methods';
import {isEmpty} from 'lodash';

@Resolver()
export class WalletResolver {
    @Query(() => [WalletOutput])
    @UseMiddleware(isAuth)
    async myWallets(
        @Ctx() ctx: ContextType,
        @Arg('currency', () => [String], {nullable: false}) currencies: string[],
        @Arg('createNew', () => Boolean, {nullable: true, defaultValue: false}) createNew?: boolean
    ): Promise<WalletOutput[]> {
        const owner = _get(ctx, 'payload.userId', '');

        try {
            // fetch or create wallets using the provided currencies
            const wallets = await Promise.all(
                currencies.map((currency) => {
                    return createFindWallet({
                        owner,
                        currency,
                        createNew,
                    });
                })
            );

            return wallets;
        } catch (error) {
            log('error getting wallets', error);
            return [];
        }
    }

    // generate a new address for the wallet
    @Mutation(() => WalletAddress, {
        nullable: true,
        description: 'Crypto only: Generate a new address for the wallet',
    })
    @UseMiddleware(isAuth)
    async getWalletAddress(
        @Ctx() ctx: ContextType,
        @Arg('currency', () => String, {nullable: false}) currency: string,
        @Arg('forceGenerate', () => Boolean, {
            nullable: true,
            description: 'if true, will not check if existing has not been used before',
        })
        forceGenerate = false
    ): Promise<WalletAddress | null> {
        const owner = _get(ctx, 'payload.userId', '');

        // check if wallet has existing address, WalletAddress.transactions === 0, if >=1 generate new address
        // if not, generate a new one
        try {
            if (!forceGenerate) {
                const existingWalletAddress = await WalletAddressModel.pagination({
                    where: {
                        owner,
                        currency,
                    },
                });

                if (isEmpty(existingWalletAddress)) {
                    throw new Error('No existing wallet address found, generate a new one');
                }

                const walletAddress = existingWalletAddress[0];

                if (walletAddress.transactions >= 1) {
                    const newWalletAddress = await createWalletAddress(owner, currency);
                    return newWalletAddress;
                } else {
                    return walletAddress;
                }
            }

            const newWalletAddress = await createWalletAddress(owner, currency);
            return newWalletAddress;
        } catch (error) {
            log('error getting wallet address', error);
            return null;
        }
    }
}

export default WalletResolver;
