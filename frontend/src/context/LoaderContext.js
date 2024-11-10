import { createContext, useState, useContext } from 'react';
import Loader from '../components/Loader/Loader';

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <Loader />} {/* Only show loader if isLoading is true */}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
