import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || '',
        token: localStorage.getItem('token') || '',
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.email = '';
            state.role = '';
            state.token = '';
            localStorage.removeItem('email');
            localStorage.removeItem('role');
            localStorage.removeItem('token');
        },
    },
});

export const { setEmail, setRole, setToken, logout } = userSlice.actions;
export default userSlice.reducer;