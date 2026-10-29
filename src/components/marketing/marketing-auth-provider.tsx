'use client';

import { createContext, useContext } from 'react';

const MarketingAuthContext = createContext(false);

type MarketingAuthProviderProps = {
  authenticated: boolean;
  children: React.ReactNode;
};

export const MarketingAuthProvider = ({
  authenticated,
  children,
}: MarketingAuthProviderProps) => {
  return (
    <MarketingAuthContext.Provider value={authenticated}>
      {children}
    </MarketingAuthContext.Provider>
  );
};

export const useMarketingAuth = () => useContext(MarketingAuthContext);
