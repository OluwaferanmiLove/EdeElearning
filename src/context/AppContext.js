import React from 'react';
import { reducer } from './reducer';
import { login } from './action';

export const AppContext = React.createContext();

const initialState = {
  loading: false,
  onBoarded: false,
  loggedin: false,
  userType: null,
  user: {},
}

function AppContextProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
