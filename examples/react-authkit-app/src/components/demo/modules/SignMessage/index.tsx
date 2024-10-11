import { useEthereum } from '@particle-network/authkit';
import { useState } from 'react';
import Button from '../Button';
import Collapse from '../Collapse';
import { Textarea } from '../InputWrapper';

import styles from './index.module.css';

type SignMessageProps = {
  activeIndex: number;
};

export default function SignMessage(props: SignMessageProps) {
  const [signValue, setSignValue] = useState(
    '\nHello Particle Network!💰💰💰 \n\nThe fastest path from ideas to deployment in a single workflow for high performance dApps.\n\nhttps://particle.network'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const { signMessage } = useEthereum();

  // Sign a message
  const handleSignMessage = async () => {
    try {
      setLoading(true);
      setResult('');

      const signature = await signMessage(signValue);

      setResult(`Signature: ${signature}`);
    } catch (error) {
      console.error('Error signing message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Collapse title='Sign Message' activeIndex={props.activeIndex}>
      <div className={styles['collapse-content']}>
        <Textarea type='textarea' label='Message' value={signValue} setValue={setSignValue} />
        <Button loading={loading} className={styles['right-btn']} onClick={handleSignMessage}>
          SIGN
        </Button>
      </div>
      {result ? <div className={styles.result}>{result}</div> : null}
    </Collapse>
  );
}
