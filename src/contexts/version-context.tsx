'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Version = 'v1' | 'v2' | 'v3';

interface VersionContextType {
  version: Version;
  setVersion: (version: Version) => void;
  availableVersions: Version[];
}

export const VersionContext = createContext<VersionContextType | undefined>(undefined);

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<Version>('v1'); // Default to v1
  const availableVersions: Version[] = ['v1', 'v2', 'v3'];

  // Load version from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVersion = localStorage.getItem('gambit-version') as Version;
      if (savedVersion && availableVersions.includes(savedVersion)) {
        setVersion(savedVersion);
      }
    }
  }, []);

  // Save version to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gambit-version', version);
    }
  }, [version]);

  return (
    <VersionContext.Provider value={{ version, setVersion, availableVersions }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  const context = useContext(VersionContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
}