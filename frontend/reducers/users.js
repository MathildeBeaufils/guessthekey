import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { token: null, username: null, email: null, isAdmin: false, nbVictoire:null, keyPoint: null, itemTete: null, itemTorse: null, itemJambes: null, itemPieds:null },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.token = action.payload.token;
            state.value.username = action.payload.username;
            state.value.email = action.payload.email;
            state.value.isAdmin = action.payload.isAdmin;
            state.value.nbVictoire = action.payload.nbVictoire;
            state.value.keyPoint = action.payload.keyPoint;
            state.value.itemTete = action.payload.chapeau;
            state.value.itemTorse = action.payload.chemise;
            state.value.itemJambes = action.payload.pentalon;
            state.value.itemPieds = action.payload.botte;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.username = null;
            state.value.email = null;
            state.value.isAdmin = null;
            state.value.nbVictoire = null;
            state.value.keyPoint = null;
            state.value.itemTete = null;
            state.value.itemTorse = null;
            state.value.itemJambes = null;
            state.value.itemPieds = null;
        },
        updateUsername:(state, action) => {
            state.value.username = action.payload.username;
        },
    },
});

export const { login, logout, updateUsername } = userSlice.actions;
export default userSlice.reducer;