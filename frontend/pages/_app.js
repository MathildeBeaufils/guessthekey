import "../styles/globals.css";
import { Provider } from "react-redux";
import user from "../reducers/users";
import missionCampagne from "../reducers/missionCampagne.js";
import creatRound from "../reducers/creatRound"
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

const reducers = combineReducers({ user, missionCampagne , creatRound});

const persistConfig = { key: 'Guess The Key', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);


function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Component {...pageProps} />        
        </PersistGate>
    </Provider>
  );
}


export default App;
