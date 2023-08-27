import {Transaction, TransactionModel} from '../transactions/Transaction.model';
import {
    Wallet,
    WalletAddress,
    WalletAddressModel,
    WalletModel,
    WalletOutput,
    walletModelName,
} from './Wallet.model';

import {CouchbaseConnection} from 'couchset';
import {StatusType} from '../shared/enums';
import {UserModel} from '@roadmanjs/auth';
import {awaitTo} from 'couchset/dist/utils';
import {generateAddress} from '../processors/btcpayserver/btcpayserver';
import isEmpty from 'lodash/isEmpty';
import {log} from '@roadmanjs/logs';

interface FindWallet {
    owner: string;
    currency: string;
    create?: boolean;
}

/**
 * Create of find the existing wallet
 * @param args
 * @returns
 * 
  @Query(() => AdsListingPagination)
  @UseMiddleware(isAuth)
  async myAds(
    @Ctx() ctx: ContextType,
    @Arg('filter', () => String, { nullable: true }) filter?: string,
    @Arg('sort', () => String, { nullable: true }) sortArg?: string,
    @Arg('before', () => Date, { nullable: true }) before?: Date,
    @Arg('after', () => Date, { nullable: true }) after?: Date,
    @Arg('owner', () => String, { nullable: false }) ownerArg?: string,
    @Arg('limit', () => Number, { nullable: true }) limitArg?: number
  ): Promise<{ items: AdsListingType[]; hasNext?: boolean; params?: any }> {
    const owner = ownerArg || _get(ctx, 'payload.userId', '');
    const bucket = CouchbaseConnection.Instance.bucketName;
    const sign = before ? '<=' : '>=';
    const time = new Date(before || after || new Date());
    const sort = sortArg || 'DESC';
    const limit = limitArg || 10;
    const limitPassed = limit + 1; // adding +1 for hasNext

    const copyParams = pickBy(
      {
        sort,
        filter,
        before,
        after,
        owner,
        limit,
      },
      identity
    );

    try {
      const query = `
              SELECT *
                  FROM \`${bucket}\` ad
                  WHERE ad._type = "${AdsListingModelName}"
                  AND ad.owner = "${owner}"
                  AND ad.createdAt ${sign} "${time.toISOString()}"
                  ORDER BY ad.createdAt ${sort}
                  LIMIT ${limitPassed};
              `;

      const [errorFetching, data = []] = await awaitTo(
        AdsListingModel.customQuery<any>({
          limit: limitPassed,
          query,
          params: copyParams,
        })
      );

      if (errorFetching) {
        throw errorFetching;
      }

      const [rows = []] = data;

      const hasNext = rows.length > limit;

      if (hasNext) {
        rows.pop(); // remove last element
      }

      const dataToSend = rows.map((d) => {
        const { ad } = d;
        return AdsListingModel.parse(ad);
      });

      return { items: dataToSend, params: copyParams, hasNext };
    } catch (error) {
      log('error getting ads', error);
      return { items: [], hasNext: false, params: copyParams };
    }
  }
 */
export const createFindWallet = async (args: FindWallet): Promise<WalletOutput> => {
    const {owner, currency, create = false} = args;
    // create wallet if not exist

    const bucket = CouchbaseConnection.Instance.bucketName;

    const query = `
              SELECT *
                  FROM \`${bucket}\` wallet
                  LEFT JOIN \`${bucket}\` owner ON KEYS wallet.owner
                  LEFT JOIN \`${bucket}\` address ON KEYS orders.address
                  WHERE wallet._type = "${walletModelName}"
                  AND wallet.owner = "${owner}"
                  AND wallet.currency = "${currency}"
              `;

    const [errorFetching, data = []] = await awaitTo(
        WalletModel.customQuery<WalletOutput>({
            limit: 1,
            query,
            params: {
                owner,
                currency,
            },
        })
    );

    if (errorFetching) {
        throw errorFetching;
    }

    const [rows = []] = data;

    const wallets = rows.map((d) => {
        const {address, owner, ...wallet} = d;
        return WalletModel.parse({...wallet, address, owner});
    });

    if (!isEmpty(wallets)) {
        return wallets.pop();
    } else if (create) {
        const newWallet: Wallet = {
            owner,
            currency,
            amount: 0,
        };

        const createdWallet = await WalletModel.create(newWallet);
        return createdWallet as WalletOutput;
    }

    throw new Error('Wallet not found');
};

export const createWalletAddress = async (
    owner: string,
    currency: string
): Promise<WalletAddress | null> => {
    const CURRENCY = currency.toUpperCase();
    try {
        // TODO other cryptos

        // BTC
        const newBtcAddress = await generateAddress(CURRENCY);

        const newWalletAddress: WalletAddress = {
            owner,
            id: newBtcAddress.address,
            currency: CURRENCY,
            transactions: 0,
        };

        const createdWalletAddress = await WalletAddressModel.create(newWalletAddress);

        return createdWalletAddress;
    } catch (error) {
        log('error creating wallet address', error);
        return null;
    }
};

interface IUpdateUserWallet {
    owner: string;
    amount: number;
    currency: string;
    source: string;
    sourceId?: string;
    message?: string;
    notification?: boolean; // future notification
    transactionHash?: string; // if source is blockchain/crypto
}

interface IUpdateWallet {
    wallet: Wallet;
    transaction: Transaction;
}

/**
 * Update Wallet
 * @param args
 * @returns
 */
export const updateWallet = async (args: IUpdateUserWallet): Promise<IUpdateWallet> => {
    const {owner, amount, source, sourceId, message, currency, transactionHash} = args;

    try {
        log('updateUserWallet', JSON.stringify({owner, amount, source, sourceId, message}));

        const existingUser = await UserModel.findById(owner);

        if (!isEmpty(existingUser)) {
            const transType = amount > 0 ? 'deposit' : 'withdraw';
            // Create a transaction

            const newTransaction: Transaction = {
                owner,
                type: transType, // withdraw or deposit
                source: source || '', // paypal, credit card, interact
                sourceId: sourceId || '', // paypal, credit card, interact
                currency: 'USD',
                amount,
                status: StatusType.SUCCESS,
                transactionHash,
            };

            // getById
            const getWallet = await createFindWallet({owner, currency, create: true});

            const currentBalance = getWallet.amount;
            const newBalance = currentBalance + amount;

            // @ts-ignore
            const updatedWallet = await WalletModel.save({
                ...getWallet,
                amount: newBalance,
            });

            const transactionCreated = await TransactionModel.create(newTransaction);
            // TODO notifications

            log('successfully update user balance');
            return {transaction: transactionCreated, wallet: updatedWallet};
        }

        throw new Error('error getting user');
    } catch (error) {
        log('error updating user wallet', error);
        throw error;
    }
};

/**
 * add payment to queue processor
 * TODO implement the queue
 */
// export const addToPaymentQueue = () => {};

// createFindWallet
