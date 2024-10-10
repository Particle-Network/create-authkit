import { useConnect } from '@particle-network/authkit';
import demoImage from '@/assets/demo.gif';
import Header from './components/header';
import Demo from './components/demo';

import styles from './App.module.css';

export default function Home() {
  const { connected } = useConnect();

  return (
    <>
      <Header />
      <main className={styles['main-content']}>
        {
          connected ? (
            <Demo />
          ) : (
            <img sizes='100%' className={styles['demo-img']} src={demoImage} alt='demo' />
          )
        }
      </main>
    </>
  )
}
