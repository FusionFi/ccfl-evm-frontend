import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { getPersistConfig } from 'redux-deep-persist';
import thunkMiddleware from 'redux-thunk';

import auth from '@/reducers/auth.reducer';
import global from '@/reducers/global.reducer';
import storage from '@/store/sync-storage.store';
const rootReducer = combineReducers({
  global,
  auth,
});

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = ({ isServer }: { isServer: boolean }) => {
  const enhancer = compose(bindMiddleware([thunkMiddleware]));
  if (isServer) {
    return createStore(rootReducer, enhancer);
  } else {
    const { persistStore, persistReducer } = require('redux-persist');

    const persistConfig = getPersistConfig({
      timeout: 1000,
      key: 'ccfl-evm-frontend',
      whitelist: ['global', 'auth'],
      storage,
      rootReducer,
    });

    const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a new reducer with our existing reducer

    const store = createStore(persistedReducer, rootReducer(undefined, {}), enhancer); // Creating the store again

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature
    return store;
  }
};

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);

export const store = makeStore({ isServer: false });
// export const store = makeStore;
