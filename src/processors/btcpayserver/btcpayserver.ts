import {MempoolTxOut, getTxAddressFromBlockchain} from './blockchain';
import {WalletAddress, WalletAddressModel, updateWallet} from '../../wallet';
import {add, isEmpty} from 'lodash';
import {btcpayServerStore, btcpayServerToken, btcpayServerUrl} from './btcpayserver.config';
import {log, verbose} from '@roadmanjs/logs';

import {TransactionModel} from '../../transactions';
import {addTxToBtcQueue} from './btcpayserver.queue';
import {awaitTo} from 'couchset/dist/utils';
// generateAddress
// [cron] getAllTransactions -> settle
import axios from 'axios';

// TODO to reflect btcpay transaction
export interface BtcpayserverTransaction {
    // transactionId: string; // hash of the transaction
    // currency: string;
    address: string;
    amount: string; // The amount the wallet balance changed with this transaction
    transactionHash: string; // The transaction id
    comment: string; // A comment linked to the transaction
    blockHash: string; // The hash of the block that confirmed this transaction.Null if still unconfirmed.
    blockHeight: string; // The height of the block that confirmed this transaction.Null if still unconfirmed.
    confirmations: string; // The number of confirmations for this transaction
    timestamp: number; // The time of the transaction
    status: string; // Enum: "Confirmed" "Unconfirmed"
}

/**
 * find transaction by hash
 * @param transactionHash
 * @returns
 */
export const transactionExists = async (transactionHash: string): Promise<boolean> => {
    try {
        // existing transaction, if not duplicate
        const [error, existingTransaction] = await awaitTo(
            TransactionModel.pagination({
                where: {
                    transactionHash,
                },
            })
        );

        if (error) {
            throw error;
        }

        return !isEmpty(existingTransaction);
    } catch (error) {
        log('Error transactionExists', error && error.message);
        return false;
    }
};

// TODO response
export const generateAddress = async (currency: string): Promise<{address: string} | null> => {
    // https://docs.btcpayserver.org/API/Greenfield/v1/#operation/StoreOnChainWallets_GetOnChainWalletReceiveAddress
    // https://docs.btcpayserver.org/api/v1/stores/{storeId}/payment-methods/onchain/{cryptoCode}/wallet/address
    const endpoint = `${btcpayServerUrl}/stores/${btcpayServerStore}/payment-methods/onchain/${currency}/wallet/address`;

    try {
        const {data} = await axios.get(endpoint, {
            headers: {
                Authorization: `token ${btcpayServerToken}`,
            },
        });

        return data;
    } catch (error) {
        console.error('Error generating address:', error);
        return null;
    }
};

export const fetchStores = async () => {
    try {
        const endpoint = btcpayServerUrl;

        const {data} = await axios.get(endpoint + '/stores', {
            headers: {
                Authorization: `token ${btcpayServerToken}`,
            },
        });

        return data;
    } catch (error) {
        console.error('Error generating stores:', error);
        return null;
    }
};

export const fetchStatus = async (currency: string) => {
    try {
        const endpoint = `${btcpayServerUrl}/stores/${btcpayServerStore}/payment-methods/onchain/${currency}/wallet?forceGenerate=true`;

        const {data} = await axios.get(endpoint, {
            headers: {
                Authorization: `token ${btcpayServerToken}`,
            },
        });

        return data;
    } catch (error) {
        console.error('Error crypto status:', error);
        return null;
    }
};

// TODO response
// use local query, if not found, push to bull queue
// use bull queue
export const fetchTransactions = async (currency: string) => {
    // https://docs.btcpayserver.org/API/Greenfield/v1/#operation/StoreOnChainWallets_ShowOnChainWalletTransactions
    // https://docs.btcpayserver.org/api/v1/stores/{storeId}/payment-methods/onchain/{cryptoCode}/wallet/transactions
    // statusFilter: "confirmed"
    // limit
    try {
        const endpoint = `${btcpayServerUrl}/stores/${btcpayServerStore}/payment-methods/onchain/${currency}/wallet/transactions?statusFilter=confirmed&limit=100`;

        const {data} = await axios.get(endpoint, {
            headers: {
                Authorization: `token ${btcpayServerToken}`,
            },
        });

        if (!isEmpty(data)) {
            await btcPayServerProcessTransactions(data);
        }

        return data;
    } catch (error) {
        console.error('Error generating transactions:', error);
        return null;
    }
};

const localProcessedTransactions = [];

export const btcPayServerProcessTransactions = async (transactions: BtcpayserverTransaction[]) => {
    try {
        // check if transaction exists in local queue
        const transactionsToProcess = transactions.filter(
            (transaction) => !localProcessedTransactions.includes(transaction.transactionHash)
        );

        // then check if transaction exists in db
        // if it exists, then add it to local queue
        const transactionsToCheckAndProcess = await Promise.all(
            transactionsToProcess.map(async (transaction) => {
                if (await transactionExists(transaction.transactionHash)) {
                    localProcessedTransactions.push(transaction.transactionHash);
                    return {transaction, transactionId: transaction.transactionHash, exists: true};
                }

                return {transaction, transactionId: transaction.transactionHash, exists: false};
            })
        );

        // if not, then add to bull queue.
        const transactionsToPushToQueue = transactionsToCheckAndProcess.filter(
            (transaction) => !transaction.exists
        );
        transactionsToPushToQueue.forEach((transaction) => {
            addTxToBtcQueue(transaction.transaction);
        });
    } catch (error) {
        console.error('Error processing transactions:', error);
        return null;
    }
};

// TODO
export const verifyTransaction = async (transactionId: string): Promise<MempoolTxOut[] | null> => {
    // get transaction using mempool.space, else kraken
    try {
        const txFromBlockchain = await getTxAddressFromBlockchain(transactionId);
        if (isEmpty(txFromBlockchain)) {
            throw new Error('transaction not found in blockchain');
        }
        return txFromBlockchain;
    } catch (error) {
        console.error('Error verifying transaction:', error);
        return null;
    }
};

export const fulfillBtcpayserver = async (payment: BtcpayserverTransaction): Promise<void> => {
    verbose('Fulfilling btcpayserver', payment);

    const markAsProcessed = async (transactionHash: string) => {
        // push to local queue, as it has been processed, to avoid checking it again
        log('markAsProcessed ', transactionHash);
        localProcessedTransactions.push(transactionHash);
    };

    try {
        const {amount: txAmount, transactionHash} = payment;

        if (isEmpty(txAmount)) {
            throw new Error('amount cannot be empty');
        }

        if (isEmpty(transactionHash)) {
            throw new Error('transactionHash cannot be empty');
        }

        // existing transaction, if not duplicate
        const [existingTransactionError, existingTransaction] = await awaitTo(
            transactionExists(transactionHash)
        );
        if (existingTransaction && !existingTransactionError) {
            throw new Error('transaction already exists = ' + transactionHash);
        }

        // get address of wallet
        // verify transaction
        const [errorVerifyingTransaction, confirmedTransaction] = await awaitTo(
            verifyTransaction(transactionHash)
        );

        if (errorVerifyingTransaction) {
            throw errorVerifyingTransaction;
        }

        if (isEmpty(confirmedTransaction)) {
            throw new Error('tx not found');
        }

        log('verifyTransaction confirmedTransaction = ', confirmedTransaction);

        await Promise.all(
            confirmedTransaction.map(async (tx) => {
                // const {address} = tx;
                const {address, amount: satoshiAmount} = tx;
                const satoshiToBtc = satoshiAmount / 100000000;

                if (isEmpty(address)) {
                    log('wallet address is empty ', {address, satoshiAmount, satoshiToBtc});
                    return Promise.resolve({data: 'address is empty'});
                }

                // find wallet address
                const [errorAddress, addressWallet] = await awaitTo(
                    WalletAddressModel.findById(address)
                );

                if (isEmpty(addressWallet) || errorAddress) {
                    log('wallet address not found = ' + address);
                    markAsProcessed(transactionHash);
                    return Promise.resolve({data: 'wallet address not found = ' + address});
                }

                const owner = addressWallet.owner;
                log('updateWallet with', {
                    satoshiToBtc,
                    owner,
                    address,
                    addressWallet,
                    transactionHash,
                });

                // this creates a new transaction
                await updateWallet({
                    owner,
                    amount: +satoshiToBtc,
                    source: WalletAddress.name,
                    sourceId: address,
                    currency: addressWallet.currency,
                    transactionHash,
                });

                // update transactions count for wallet address
                await WalletAddressModel.updateById(address, {
                    ...addressWallet,
                    transactions: add(addressWallet.transactions || 0, 1),
                });

                // push to local queue, as it has been processed, to avoid checking it again
                return markAsProcessed(transactionHash);
            })
        );
    } catch (error) {
        log('Error fullfilling btcpayserver transaction', error);
        return null;
    }
};
