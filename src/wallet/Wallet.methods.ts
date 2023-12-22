import {Transaction, TransactionModel} from '../transactions/Transaction.model';
import {
    Wallet,
    WalletAddress,
    WalletAddressModel,
    WalletModel,
    WalletOutput,
    walletModelName,
} from './Wallet.model';
import {
    createTransactions as createTransactionsBtc,
    generateAddress,
    txDest,
} from '../processors/btcpayserver/btcpayserver';
import {createTransactionsXmr, generateAddressXmr} from '../processors/monerox/monerox';

import {CouchbaseConnection} from 'couchset';
import {StatusType} from '../shared/enums';
import {UserModel} from '@roadmanjs/auth';
import {awaitTo} from 'couchset/dist/utils';
import isEmpty from 'lodash/isEmpty';
import {log} from '@roadmanjs/logs';

// createTransactions
export const walletAddressApi = {
    BTC: generateAddress,
    XMR: generateAddressXmr,
};

export const walletTxApi = {
    BTC: createTransactionsBtc,

    /**
     *
     * @param _cur
     * @param dest only one destination is allowed
     * @returns
     */
    XMR: (_cur: string, dest: txDest[]) => createTransactionsXmr(dest[0]),
};

interface FindWallet {
    owner: string;
    currency: string;
    createNew?: boolean;
}

export const createFindWallet = async (args: FindWallet): Promise<WalletOutput> => {
    const {owner, currency, createNew = false} = args;
    // create wallet if not exist

    const bucket = CouchbaseConnection.Instance.bucketName;

    const query = `
              SELECT *
                  FROM \`${bucket}\` wallet
                  LEFT JOIN \`${bucket}\` owner ON KEYS wallet.owner
                  LEFT JOIN \`${bucket}\` address ON KEYS wallet.address
                  WHERE wallet._type = "${walletModelName}"
                  AND wallet.owner = "${owner}"
                  AND wallet.currency = "${currency}"
              `;

    const [errorFetching, data = []] = await awaitTo(
        WalletModel.customQuery<WalletOutput & {wallet: Wallet}>({
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
        const wallet = d.wallet ? WalletModel.parse(d.wallet) : null;
        const address = d.address ? WalletAddressModel.parse(d.address) : null;
        const owner = d.owner ? UserModel.parse(d.owner) : null;
        return {...wallet, address, owner};
    });

    if (!isEmpty(wallets)) {
        return wallets.pop();
    } else if (createNew) {
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
    try {
        if (isEmpty(owner) || isEmpty(currency)) throw new Error('error creating wallet address');

        const CURRENCY = currency.toUpperCase();
        // the wallet must exist
        const wallet = await createFindWallet({owner, currency: CURRENCY, createNew: true});
        if (isEmpty(wallet)) {
            throw new Error('error creating wallet address');
        }

        const api = walletAddressApi[CURRENCY];
        const newAddress = await api(CURRENCY);

        if (isEmpty(newAddress)) throw new Error('error creating wallet address');

        const newWalletAddress: WalletAddress = {
            owner,
            id: newAddress.address,
            currency: CURRENCY,
            transactions: 0,
        };

        const createdWalletAddress = await WalletAddressModel.create(newWalletAddress);

        await WalletModel.updateById(wallet.id, {
            ...wallet,
            owner,
            address: createdWalletAddress.id,
        });

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
    const {owner, amount, source, sourceId, message, currency = 'USD', transactionHash} = args;
    const CURRENCY = currency.toUpperCase();

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
                currency: CURRENCY,
                amount,
                status: StatusType.SUCCESS,
                transactionHash,
            };

            const getWallet = await WalletModel.pagination({
                where: {
                    owner,
                    currency: CURRENCY,
                },
            });

            if (isEmpty(getWallet)) throw new Error('error getting user wallet');

            const wallet = getWallet.shift();

            log('existing wallet', wallet);

            const currentBalance = wallet.amount;
            const newBalance = currentBalance + amount;

            const updatedWallet = await WalletModel.updateById(wallet.id, {
                ...wallet,
                amount: newBalance,
            });

            log('updatedWallet wallet', updatedWallet);

            const transactionCreated = await TransactionModel.create(newTransaction);

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
