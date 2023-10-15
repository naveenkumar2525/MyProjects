import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
// ----------------------------------------------------------------------
const sagaMiddleware = createSagaMiddleware();

const Store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      thunk: false
    }),
    sagaMiddleware
  ]
});
sagaMiddleware.run(rootSaga);

const persistor = persistStore(Store);

export { Store, persistor };

//store.dispatch({ type: 'anlytics/getAnlytics' });
