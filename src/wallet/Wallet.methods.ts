import {Transaction, TransactionModel} from '../transactions/Transaction.model';
import {Wallet, WalletModel} from './Wallet.model';

import {StatusType} from '../shared/enums';
import {UserModel} from '@roadmanjs/auth';
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
 */
export const createFindWallet = async (args: FindWallet): Promise<Wallet> => {
    const {owner, currency, create = false} = args;
    // create wallet if not exist
    try {
        const wallets = await WalletModel.pagination({
            select: '*', // TODO selectors
            where: {
                owner: {$eq: owner},
                currency: {$eq: currency},
            },
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
            return createdWallet;
        }

        throw new Error('Wallet not found');
    } catch (err) {
        throw err;
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
    const {owner, amount, source, sourceId, message, currency} = args;

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
            };

            const getWallet = await createFindWallet({owner, currency, create: true});

            const currentBalance = getWallet.amount;
            const newBalance = currentBalance + amount;

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
