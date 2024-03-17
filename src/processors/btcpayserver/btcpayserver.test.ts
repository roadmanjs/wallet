import 'mocha';
import "dotenv/config";
import "reflect-metadata"

import { expect } from 'chai';
import { fetchTransactions } from "./btcpayserver";

const externalAddress = "399KPGqPiNqRygRtf6SYQUb5YHRH5BeWiz";

describe('Btcpayserver', () => {
    // it('it should fetch all stores', async () => {
    //     const stores = await fetchStores();
    //     console.log('all stores', stores);
    //     expect(stores).to.be.not.null;
    // });

    // it('it should fetch rates', async () => {
    //     const rates = await fetchRates("BTC_USD,EUR_BTC");
    //     console.log('all stores', rates);
    //     expect(rates).to.be.not.null;
    // });

    // it('it should create an address', async () => {
    //     const address = await generateAddress('BTC');
    //     console.log('created the address', address);
    //     expect(address).to.be.not.null;
    // });

    it('it should get all transactions', async () => {
        const transactions = await fetchTransactions('btc');
        console.log('all transactions', transactions);
        expect(transactions).to.be.not.null;
    });


    // 

    // it('it should get transaction address from blockchain', async () => {
    //     const transactionAddress = await getTxAddressFromBlockchain('84e6623c36b2f1f9b38fbf3ed663efa5c1f172c6c3f1d32e4aa69fb2a77b6987');
    //     console.log('transactionAddress', transactionAddress);
    //     expect(transactionAddress.map(tx => tx.address)).to.include(externalAddress)
    // });

    // it('it should get transaction address from blockchain', async () => {
    //     const transactionAddress = await getTxAddressFromBlockchain('a29d731ae7619d1194787d95b82b655c9f3e35d792ae23eeeefb07d5e8e7d638');
    //     console.log('transactionAddress', transactionAddress);
    //     expect(transactionAddress.map(tx => tx.address)).to.include("bc1qn3jmr0tsujhdw753vvptudaeuasval25snuytc")
    // });

    // it('it should create a transactions', async () => {
    //     const transactions = await createTransactions('btc', [
    //         { amount: "0.0006131", destination: externalAddress, subtractFromAmount: true }
    //     ]);

    //     console.log('created transaction', transactions);
    //     expect(transactions).to.be.not.null;
    // });


});
