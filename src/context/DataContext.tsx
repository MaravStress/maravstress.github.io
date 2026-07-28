import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import initialBd from '../data/bd.json';

interface DataContextType {
  data: typeof initialBd | any;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  data: initialBd,
  loading: false,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<any>(initialBd);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    // Subscribe to Firebase Realtime Database live data (Public read - no auth needed)
    const portfolioRef = ref(db, 'portfolio/bdData');
    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.val();
          if (remoteData && typeof remoteData === 'object') {
            // Merge with initialBd structure to prevent undefined property errors
            setData({
              ...initialBd,
              ...remoteData
            });
          }
        }
        setLoading(false);
      },
      (error) => {
        console.warn("No se pudo cargar desde Firebase Realtime Database. Usando bd.json local:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const usePortfolioData = () => useContext(DataContext);
