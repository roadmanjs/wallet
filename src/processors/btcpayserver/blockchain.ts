import axios from 'axios';

interface Vin {
    txid: string;
    vout: number;
    prevout: Prevout;
    scriptsig: string;
    scriptsig_asm: string;
    witness: string[];
    is_coinbase: boolean;
    sequence: number;
}

interface Prevout {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
}
interface Vout {
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
}

interface Status {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
}

export interface MempoolTx {
    txid: string;
    version: number;
    locktime: number;
    vin: Vin[];
    vout: Vout[];
    size: number;
    weight: number;
    fee: number;
    status: Status;
}

export interface MempoolTxOut {
    address: string;
    amount: number;
}

// get transaction using mempool.space, else kraken
// TODO get transaction from kraken if mempool.space fails
// TODO set KRACKEN_API_KEY and KRACKEN_API_SECRET in .env
export const getTxAddressFromBlockchain = async (
    transactionHash: string
): Promise<MempoolTxOut[] | null> => {
    try {
        const endpoint = `https://mempool.space/api/tx/${transactionHash}`;
        const {data} = await axios.get<MempoolTx>(endpoint);

        const sender = data.vin[0].prevout.scriptpubkey_address;

        const voutWithSender = data.vout.filter((vout) => vout.scriptpubkey_address !== sender);

        return voutWithSender.map((vout) => ({
            address: vout.scriptpubkey_address,
            amount: vout.value,
        }));
    } catch (error) {
        console.error('Error getting transaction:', error);
        return null;
    }
};
