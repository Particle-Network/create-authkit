import Image from 'next/image'
import logo from '@/assets/images/logo.png';
import { useConnect } from '@particle-network/authkit';
import Link from 'next/link'

import styles from './index.module.css';

export default function Header() {
  const { connect, connectionStatus, disconnect } = useConnect();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
        console.log(error);
    }
};

const handleDisconnect = async () => {
    try {
        await disconnect();
    } catch (error) {
        console.log(error);
    }
};

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles['nav-start']}>
          <Image src={logo} width={150} height={36} alt="logo"></Image>
        </div>
        <div className={styles['nav-content']}>
          <Link           
            href="https://developers.particle.network/guides/wallet-as-a-service/waas/connect/web-quickstart"
            target="_blank"
          >
            <div className={styles['nav-item']}>Docs</div>
          </Link>
          <Link           
            href="https://github.com/Particle-Network"
            target="_blank"
          >
            <div className={styles['nav-item']}>Github</div>
          </Link>
          <Link           
            href="https://particle.network/"
            target="_blank"
          >
            <div className={styles['nav-item']}>About</div>
          </Link>
          <Link           
            href="https://demo.particle.network/"
            target="_blank"
          >
            <div className={styles['nav-item']}>Demo</div>
          </Link>
        </div>
        <div className={styles['nav-end']}>
          {connectionStatus !== 'connected' && (
              <button className={styles.btn} onClick={handleConnect}>
                {connectionStatus === 'disconnected' ? 'Connect' : connectionStatus.toUpperCase()}
               </button>
          )}
          {connectionStatus === 'connected' && (
             <button className={styles.btn} onClick={handleDisconnect}>
                Disconnect
            </button>
          )}
        </div>
      </nav>
    </div>  
  )
}