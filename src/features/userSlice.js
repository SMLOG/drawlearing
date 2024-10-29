// features/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: 'John Doe',
        age: 30,
    },
    reducers: {
        updateUser: (state, action) => {
            state.name = action.payload.name;
            state.age = action.payload.age;
        },
    },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
