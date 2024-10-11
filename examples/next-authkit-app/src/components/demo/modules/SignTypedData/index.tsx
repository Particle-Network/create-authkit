'use client';

import { useEthereum } from '@particle-network/authkit';
import { useState } from 'react';
import { toHex } from 'viem';
import Button from '../Button';
import Collapse from '../Collapse';
import { Textarea } from '../InputWrapper';
import styles from './index.module.css';

export default function SignTypedData() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { signTypedData, switchChain, address } = useEthereum();
  // Address tied to the connected wallet (or social login)

  const [signTypedDataValue, setSignTypedDataValue] = useState(
    `{
        domain: {
          name: 'NFT Marketplace',
          version: '1',
          chainId: 1,
          verifyingContract: '0x1234567890123456789012345678901234567890',
        },
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Order: [
            { name: 'maker', type: 'address' },
            { name: 'tokenContract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
            { name: 'price', type: 'uint256' },
            { name: 'expirationTime', type: 'uint256' },
            { name: 'salt', type: 'uint256' },
          ],
        },
        primaryType: 'Order',
        message: {
          maker: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          tokenContract: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
          tokenId: '123456',
          price: '1000000000000000000',
          expirationTime: '1690000000',
          salt: '31337',
        },
      }
  `
  );

  // Sign typed data
  const handleSignTypedData = async () => {
    try {
      setLoading(true);
      setResult('');

      const data = eval(`(${signTypedDataValue})`);
      const chainId = data?.domain?.chainId;
      await switchChain(toHex(chainId));

      const signature = await signTypedData({
        data,
        version: 'V4' as any,
      });
      setResult(`signature: ${signature}`);
    } catch (error) {
      console.error('Error signing typed data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapse title='Sign Typed Data' activeIndex={3}>
      <div className={styles['collapse-content']}>
        <Textarea type='textarea' label='Message' value={signTypedDataValue} setValue={setSignTypedDataValue} />
        <Button loading={loading} className={styles['right-btn']} onClick={handleSignTypedData}>
          SIGN
        </Button>
      </div>
      {result ? <div className={styles.result}>{result}</div> : null}
    </Collapse>
  );
}
