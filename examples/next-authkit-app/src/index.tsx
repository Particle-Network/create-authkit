'use client';

import { useConnect } from '@particle-network/authkit';
import Image from 'next/image';
import demoImage from '@/assets/demo.gif';
import Header from './components/header';
import Demo from './components/demo';

import styles from './index.module.css';

export default function Home() {
  const { connect, disconnect, connected } = useConnect();

  return (
    <>
      <Header />
      <main className={styles['main-content']}>
        {
          connected ? (
            <Demo />
          ) : (
            <Image sizes='100%' src={demoImage} alt='demo' />
          )
        }
      </main>
    </>
  )
}
