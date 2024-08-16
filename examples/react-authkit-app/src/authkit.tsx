'use client';

import { AuthCoreContextProvider, PromptSettingType } from '@particle-network/authkit';
import { mainnet, polygon } from '@particle-network/authkit/chains';
import { EntryPosition } from '@particle-network/wallet';

export const ParticleAuthkit = ({ children }: React.PropsWithChildren) => {
  return (
    <AuthCoreContextProvider
      options={{
        projectId: process.env.REACT_APP_PROJECT_ID as string,
        clientKey: process.env.REACT_APP_CLIENT_KEY as string,
        appId: process.env.REACT_APP_APP_ID as string,
        // Locks the chain selector to Ethereum and Polygon
        chains: [mainnet, polygon],
        language: 'en',
        // You can prompt the user to set up extra security measure upon login or other interactions
        promptSettingConfig: {
          promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
          promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        },
        wallet: {
          // Set to false to remove the embedded wallet modal
          visible: true,
          entryPosition: EntryPosition.BR,
        },
      }}
    >
      {children}
    </AuthCoreContextProvider>
  );
};
