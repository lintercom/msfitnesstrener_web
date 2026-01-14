
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { SiteData } from '../types';
import { initialData } from '../data/initialData';

interface DataContextType {
  data: SiteData;
  setData: React.Dispatch<React.SetStateAction<SiteData>>;
  loading: boolean;
  exportDataForHosting: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to check if user is admin (without importing AuthContext to avoid circular dependency)
const isAdminUser = (): boolean => {
  try {
    const loggedInUserId = sessionStorage.getItem('printcore-auth-userid');
    return loggedInUserId === 'admin';
  } catch {
    return false;
  }
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(initialData);
  const [loading, setLoading] = useState(true);
  // Pozn.: obsah webu držíme pouze na serveru (website_content.json + save-content.php),
  // localStorage nepoužíváme pro SiteData, aby všichni viděli stejné hodnoty.

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // Zjištění admina necháváme jen kvůli exportu / UI, ne kvůli perzistenci obsahu
      void isAdminUser();

      try {
        // Vždy načítáme ze serveru (pro admina i návštěvníky)
        try {
          const contentUrl = `${import.meta.env.BASE_URL}website_content.json?${Date.now()}`; // Cache busting
          const response = await fetch(contentUrl);

          if (response.ok) {
            const serverData = await response.json();
            if (!serverData.appearance) {
              serverData.appearance = initialData.appearance;
            }
            if (!serverData.homeDecorations) {
              serverData.homeDecorations = initialData.homeDecorations;
            } else {
              // Doplnit nová pole do homeDecorations (zpětná kompatibilita)
              if (!serverData.homeDecorations.heroText) {
                serverData.homeDecorations.heroText = initialData.homeDecorations.heroText;
              } else {
                serverData.homeDecorations.heroText = {
                  ...initialData.homeDecorations.heroText,
                  ...serverData.homeDecorations.heroText,
                };
              }
            }
            setData(serverData);
          } else {
            // Fallback to initial data if server file doesn't exist
            console.warn('website_content.json not found, using initial data');
            setData(initialData);
          }
        } catch (fetchError) {
          console.error("Failed to fetch data from server", fetchError);
          // Fallback to initial data
          setData(initialData);
        }
      } catch (error) {
        console.error("Failed to load data", error);
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Už nesledujeme admin přes interval – na obsah to nemá vliv a zbytečně to běží pořád.
  }, []);

  // Export function for admin to download JSON for hosting
  const exportDataForHosting = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'website_content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <DataContext.Provider value={{ data, setData, loading, exportDataForHosting }}>
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
