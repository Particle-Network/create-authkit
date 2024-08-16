'use client';

import { useConnect } from '@particle-network/authkit';

export default function Home() {
  const { connect } = useConnect();
  return (
    <div>
      <button onClick={() => connect()}>Connect</button>
    </div>
  );
}
