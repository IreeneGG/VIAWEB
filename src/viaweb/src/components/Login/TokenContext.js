import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  return (
    <TokenContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
