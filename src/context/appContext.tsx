import { createContext, useState, useContext } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';

interface AppContextType {
  avatar: Group | null;
  setAvatar: (avatar: Group | null) => void;
  clothing: Group | null;
  setClothing: (clothing: Group | null) => void;
  clothingVisible: boolean;
  setClothingVisible: (visible: boolean) => void;
  clothingColor: string;
  setClothingColor: (color: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [avatar, setAvatar] = useState<Group | null>(null);
  const [clothing, setClothing] = useState<Group | null>(null);
  const [clothingVisible, setClothingVisible] = useState(true);
  const [clothingColor, setClothingColor] = useState('#8888ff');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        avatar,
        setAvatar,
        clothing,
        setClothing,
        clothingVisible,
        setClothingVisible,
        clothingColor,
        setClothingColor,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);