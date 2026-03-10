import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import compareReducer from './compareSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        compare: compareReducer,
    },
});

export default store;