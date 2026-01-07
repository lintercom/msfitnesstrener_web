
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { SiteData } from '../types';
import { initialData } from '../data/initialData';

interface DataContextType {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('printcore-data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        
        // Ensure appearance object exists fully
        if (!parsedData.appearance) {
             parsedData.appearance = initialData.appearance;
        }

        setData(parsedData);
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('printcore-data', JSON.stringify(data));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [data, loading]);

  return (
    <DataContext.Provider value={{ data, setData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
