// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import themeReducer from './features/themeSlice';
import settingsReducer from './features/settingsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
        settings: settingsReducer,
    },
});

export default store;
