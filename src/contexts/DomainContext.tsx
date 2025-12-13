import React, { createContext, useContext, useState, useEffect } from 'react';

export type Domain = 'software' | 'ece';

interface DomainContextType {
  domain: Domain;
  setDomain: (domain: Domain) => void;
  toggleDomain: () => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domain, setDomain] = useState<Domain>(() => {
    const saved = localStorage.getItem('portfolio-domain');
    return (saved as Domain) || 'software';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-domain', domain);
  }, [domain]);

  const toggleDomain = () => {
    setDomain(prev => prev === 'software' ? 'ece' : 'software');
  };

  return (
    <DomainContext.Provider value={{ domain, setDomain, toggleDomain }}>
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
};
