import { configureStore } from '@reduxjs/toolkit';
import appStateSlice from './features/appStateSlice';
import storageBarSlice from './features/storageBarSlice';

export const store = configureStore({
    reducer: {
        appState: appStateSlice,
        updateStorageBar: storageBarSlice
    }
});