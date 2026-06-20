'use client';

import React, { createContext, useContext } from 'react';

const SiteDataContext = createContext();

export const useSiteData = () => useContext(SiteDataContext);

export function SiteDataProvider({ settings, children }) {
  return (
    <SiteDataContext.Provider value={{ settings }}>
      {children}
    </SiteDataContext.Provider>
  );
}
