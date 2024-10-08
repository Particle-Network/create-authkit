import { ArrowIcon } from '@/components/icons';
import { toWei } from '@/utils/number-utils';
import { useConnect, useEthereum } from '@particle-network/authkit';
import { Button, Input, InputNumber, message, notification } from 'antd';
import { Interface } from 'ethers';
import { useState } from 'react';
import { isValidEVMAddress } from '../../../utils';
import events from '../../../utils/eventBus';

function ERC4337SendERC20Tokens() {
  const [loading, setLoading] = useState(0);
  const [fold, setFold] = useState(true);
  const defReceiveAddress: string = '0x6Bc8fd522354e4244531ce3D2B99f5dF2aAE335e';
  const defContractAddress: string = '0xDF27A250c425Ba6721d399bf09259e6a089D6157';
  const defErcAmount: string = '0.001';

  const [receiveAddress, setReceiveAddress] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [ercAmount, setErcAmount] = useState<string>();

  const { connected } = useConnect();
  const { address, chainInfo } = useEthereum();

  const sendTransaction = async (send: (tx: any) => Promise<string>) => {
    const address = receiveAddress || defReceiveAddress;
    const amountWei = toWei(ercAmount || defErcAmount, 'ether');
    const contract = contractAddress || defContractAddress;

    if (!isValidEVMAddress(address)) {
      return notification.error({
        message: 'Please enter the correct receive address',
      });
    }
    if (!isValidEVMAddress(contract)) {
      return notification.error({
        message: 'Please enter the correct contract address',
      });
    }
    const erc20Interface = new Interface(['function transfer(address _to, uint256 _value)']);
    // Encode an ERC-20 token transfer to recipient of the specified amount
    const data = erc20Interface.encodeFunctionData('transfer', [address, amountWei]);
    const tx = {
      to: contract,
      data,
    };
    try {
      const txHash = await send(tx);
      if (txHash) {
        notification.success({
          message: 'Send Transaction Success',
          description: txHash,
          onClick: () => {
            window.open(`${chainInfo?.blockExplorers?.default.url}/tx/${txHash}`);
          },
        });
      } else {
        notification.error({
          message: 'Send UserOp Failure',
          description: 'tx hash is null',
        });
      }
    } catch (error: any) {
      console.log('sendERC20Transaction', error);
      if (error.code !== 4011) {
        const msg = error.data?.extraMessage || error.message;
        if (msg) {
          message.error(msg);
        }
      }
    } finally {
      setLoading(0);
    }
  };

  const sendERC20Transaction = async (tx: any) => {
    setLoading(1);
    const feeQuotesResult = await window.smartAccount.getFeeQuotes(tx);
    const txHash = await new Promise<string>((resolve, reject) => {
      events.removeAllListeners('erc4337:sendTransaction');
      events.removeAllListeners('erc4337:sendTransactionError');
      events.once('erc4337:sendTransaction', async (params: any) => {
        try {
          if (params.feeQuote) {
            const hash = await window.smartAccount.sendTransaction({ ...params, tx });
            resolve(hash);
          } else {
            const hash = await window.smartAccount.sendTransaction(params);
            resolve(hash);
          }
        } catch (error) {
          reject(error);
        }
      });
      events.once('erc4337:sendTransactionError', (error) => {
        reject(error);
      });
      events.emit('erc4337:prepareTransaction', feeQuotesResult);
    });
    return txHash;
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
        Send ERC20 Token
        <ArrowIcon className={fold ? 'arrow-icon' : 'arrow-icon rotate'} />
      </h3>
      <div className={`fold-content ${fold ? '' : 'display'}`}>
        <div className="form-input">
          <label>
            <p>Receive address</p>
            <Input
              placeholder={defReceiveAddress}
              readOnly={!!loading}
              // @ts-ignore
              onInput={(e) => setReceiveAddress(e.target.value)}
            />
          </label>
          <label>
            <p>Contract address</p>
            <Input
              placeholder={defContractAddress}
              readOnly={!!loading}
              // @ts-ignore
              onInput={(e) => setContractAddress(e.target.value)}
            />
          </label>
          <label>
            <p>Token amount</p>
            <InputNumber
              min={0}
              max={10000}
              precision={5}
              placeholder={defErcAmount + ''}
              readOnly={!!loading}
              onChange={(e) => setErcAmount(e?.toString() || '')}
            ></InputNumber>
          </label>
        </div>

        <div className="form-submit">
          <Button
            disabled={!connected || !address}
            type="primary"
            loading={loading === 1}
            onClick={() => sendTransaction(sendERC20Transaction)}
          >
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ERC4337SendERC20Tokens;
