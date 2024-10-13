'use client';

import { AuthCoreContextProvider, PromptSettingType } from '@particle-network/authkit';
import { mainnet, polygon, lineaSepolia } from '@particle-network/authkit/chains';
import { EntryPosition } from '@particle-network/wallet';

export const ParticleAuthkit = ({ children }: React.PropsWithChildren) => {
  return (
    <AuthCoreContextProvider
      options={{
        projectId: 'b9036c26-ed43-4050-912b-da07266c9407',
        clientKey: 'cQ3msMq0BiHTuV9csvCJJnDnrvhTeCVIbO9qk4sH',
        appId: 'a3167218-5b1d-454f-9d7f-4a58c67cf8fb',
        // Locks the chain selector to Ethereum and Polygon
        chains: [mainnet, polygon, lineaSepolia],
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
