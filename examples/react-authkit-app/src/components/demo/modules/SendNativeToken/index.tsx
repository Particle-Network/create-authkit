import { useState } from 'react';
import { useEthereum } from '@particle-network/authkit'
import { parseEther, type Address } from 'viem';
import Collapse from '../Collapse';
import Button from '../Button';
import { Input } from '../InputWrapper';
import styles from './index.module.css';

export default function SendNativeToken() {
  const [loading, setLoading] = useState(false);
  const [toAddress, setToAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('')
  const [result, setResult] = useState<string>('');
  const { sendTransaction } = useEthereum();

  const handleSendTransaction = async () => {
    try {
      setLoading(true)
      setResult('')
      // Prepare the transaction object
      const tx = {
        to: toAddress as Address,
        value: parseEther(amount as string).toString(),
        data: '0x' as Address, // No contract interaction, so data is empty
      };
  
      // Get the wallet client and send the transaction
      const transactionResponse = await sendTransaction(tx);
  
      setResult(`Transaction Hash: ${transactionResponse}`)
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }

  return (
    <Collapse title="Send Native Token" activeIndex={1}>
      <div className={styles['collapse-content']}>
        <Input type='text' label="Receive address" placeholder="0x..." value={toAddress} setValue={setToAddress} />
        <Input type='number' label="Token amount"  placeholder="amount in wei" suffix="wei" value={amount} setValue={setAmount} />
        <Button loading={loading} block="true" onClick={handleSendTransaction}>SEND TRANSACTION</Button>
      </div>
      {
        result ? (
          <div className={styles.result}>{result}</div>
        ) : null
      }
    </Collapse>
  )
}