import {Resolver, Query, Arg, UseMiddleware, Ctx, Mutation} from 'type-graphql';
import _get from 'lodash/get';
import {log} from '@roadmanjs/logs';
import {ContextType, isAuth} from '@roadmanjs/auth';
import {WalletAddressModel, WalletOutput} from './Wallet.model';
import {createFindWallet, createWalletAddress} from './Wallet.methods';
import {isEmpty} from 'lodash';
import {ResType} from 'couchset';

@Resolver()
export class WalletResolver {
    @Query(() => [WalletOutput], {nullable: true})
    @UseMiddleware(isAuth)
    async myWallets(
        @Ctx() ctx: ContextType,
        @Arg('currency', () => [String], {nullable: false}) currencies: string[],
        @Arg('createNew', () => Boolean, {nullable: true, defaultValue: false}) createNew?: boolean
    ): Promise<WalletOutput[]> {
        const owner = _get(ctx, 'payload.userId', '');

        try {
            if (isEmpty(currencies)) {
                throw new Error('No currencies provided');
            }

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
    @Mutation(() => ResType)
    @UseMiddleware(isAuth)
    async getWalletAddress(
        @Ctx() ctx: ContextType,
        @Arg('currency', () => String, {nullable: false}) currency: string,
        @Arg('forceGenerate', () => Boolean, {
            nullable: true,
            description: 'if true, will not check if existing has not been used before',
        })
        forceGenerate = false
    ): Promise<ResType> {
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

                if (walletAddress.transactions < 1) {
                    throw new Error(
                        'Address has not been used before, use it then, generate a new one'
                    );
                }
            }

            const newWalletAddress = await createWalletAddress(owner, currency);
            return {data: WalletAddressModel.parse(newWalletAddress), success: true};
        } catch (error) {
            log('error getting wallet address', error);
            return {message: error?.message, success: false};
        }
    }
}

export default WalletResolver;
