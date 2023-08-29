import 'mocha';
import "dotenv/config";
import "reflect-metadata"

import { fetchRates, fetchStatus, fetchStores, fetchTransactions, generateAddress } from "./btcpayserver";

import { expect } from 'chai';
import { getTxAddressFromBlockchain } from "./blockchain";

describe('Btcpayserver', () => {
    // it('it should fetch all stores', async () => {
    //     const stores = await fetchStores();
    //     console.log('all stores', stores);
    //     expect(stores).to.be.not.null;
    // });

    it('it should fetch rates', async () => {
        const rates = await fetchRates("BTC_USD,EUR_BTC");
        console.log('all stores', rates);
        expect(rates).to.be.not.null;
    });

    // it('it should create an address', async () => {
    //     const address = await generateAddress('BTC');
    //     console.log('created the address', address);
    //     expect(address).to.be.not.null;
    // });

    // it('it should get all transactions', async () => {
    //     const transactions = await fetchTransactions('btc');
    //     console.log('all transactions', transactions);
    //     expect(transactions).to.be.not.null;
    // });

    // it('it should get transaction address from blockchain', async () => {
    //     const transactionAddress = await getTxAddressFromBlockchain('a29d731ae7619d1194787d95b82b655c9f3e35d792ae23eeeefb07d5e8e7d638');
    //     console.log('transactionAddress', transactionAddress);
    //     expect(transactionAddress.map(tx => tx.address)).to.include("bc1qn3jmr0tsujhdw753vvptudaeuasval25snuytc")
    // });


});
