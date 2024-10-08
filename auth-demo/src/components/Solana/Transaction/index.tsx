import { ArrowIcon } from '@/components/icons';
import { useConnect, useSolana } from '@particle-network/authkit';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Button, Input, InputNumber, notification } from 'antd';
import { useState } from 'react';
import { getSolanaChainInfoById, isValidSolanaAddress } from '../../../utils';

function Transcation() {
  const [loading, setLoading] = useState<number>(0);
  const [fold, setFold] = useState(true);
  const defReceiveAddress: string = 'F4FGwoBDM8HZJjGWnhqnh5xwNssbcPgQKD4mEK1r7rjo';
  const defAmount: string = '0.001';
  const [receiveAddress, setReceiveAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [specifiedChainId, setSpecifiedChainId] = useState<number>();

  const { connected } = useConnect();
  const { chainId, address: account, signAndSendTransaction: solanaSignAndSendTransaction } = useSolana();

  const signAndSendTransaction = async () => {
    setLoading(1);
    try {
      const tx = new Transaction();
      const toAddress = receiveAddress || defReceiveAddress;
      if (!isValidSolanaAddress(toAddress)) {
        setLoading(0);
        return notification.error({
          message: 'Please enter the correct Public key',
        });
      }

      tx.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(account!),
          toPubkey: new PublicKey(toAddress),
          lamports: Number(amount || defAmount) * 1000000000,
        })
      );

      const latestBlockhash = await window.particleAuth?.solana.request({
        method: 'getLatestBlockhash',
        params: [
          {
            commitment: 'finalized',
          },
        ],
        chainId: specifiedChainId,
      });
      const { blockhash, lastValidBlockHeight } = latestBlockhash?.value || {};
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = new PublicKey(account!);

      // // create array of instructions
      // const instructions = [
      //     SystemProgram.transfer({
      //         fromPubkey: new PublicKey(account!),
      //         toPubkey: new PublicKey(toAddress),
      //         lamports: Number(amount || defAmount) * 1000000000,
      //     }),
      // ];

      // // create v0 compatible message
      // const messageV0 = new TransactionMessage({
      //     payerKey: new PublicKey(account!),
      //     recentBlockhash: blockhash,
      //     instructions,
      // }).compileToV0Message();

      // // make a versioned transaction
      // const transactionV0 = new VersionedTransaction(messageV0);

      const { signature } = await solanaSignAndSendTransaction(tx, specifiedChainId);
      const chainInfo = getSolanaChainInfoById(specifiedChainId || chainId);
      notification.success({
        message: 'Send Transaction Success',
        description: signature,
        onClick: () => {
          window.open(
            `${chainInfo?.blockExplorers?.default.url}/tx/${signature}?cluster=${(
              (chainInfo?.custom?.network || '') as string
            )?.toLowerCase?.()}`
          );
        },
      });
    } catch (error: any) {
      notification.error({
        message: 'Send Error',
        description: error?.message || '',
      });
    } finally {
      setLoading(0);
    }
  };

  return (
    <div className="form-item">
      <h3
        onClick={() => {
          setFold(!fold);
        }}
        style={{
          cursor: 'pointer',
        }}
      >
        Sign And Send Transaction
        <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
      </h3>
      <div className={`fold-content ${fold ? '' : 'display'}`}>
        <div className="form-input">
          <label>
            <p>Receive address</p>
            <Input
              placeholder={defReceiveAddress}
              readOnly={!!loading}
              onInput={(e: any) => setReceiveAddress(e.target?.value)}
            ></Input>
          </label>
          <label>
            <p>Token amount</p>
            <InputNumber
              min={0}
              max={10000}
              precision={5}
              placeholder={defAmount}
              readOnly={!!loading}
              onChange={(e) => setAmount(e?.toString() || '')}
            ></InputNumber>
          </label>
          <label>
            <p>Chain ID (optional)</p>
            <InputNumber
              min={1}
              placeholder="Send the transaction to the specified chain"
              precision={0}
              readOnly={!!loading}
              onChange={(e: any) => {
                if (e) {
                  setSpecifiedChainId(Number(e.toFixed(0)));
                } else {
                  setSpecifiedChainId(undefined);
                }
              }}
            ></InputNumber>
          </label>
        </div>

        <div className="form-submit">
          <Button
            type="primary"
            loading={loading === 1}
            onClick={signAndSendTransaction}
            disabled={!connected || !account}
          >
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Transcation;
