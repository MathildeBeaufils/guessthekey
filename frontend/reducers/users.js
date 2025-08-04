import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { token: null, username: null, email: null, isAdmin: false, nbVictoire:null, keyPoint: null, chapeau: null, chemise: null, pentalon: null, botte:null },
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
            state.value.chapeau = action.payload.chapeau;
            state.value.chemise = action.payload.chemise;
            state.value.pentalon = action.payload.pentalon;
            state.value.botte = action.payload.botte;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.username = null;
            state.value.email = null;
            state.value.isAdmin = null;
            state.value.nbVictoire = null;
            state.value.keyPoint = null;
            state.value.chapeau = null;
            state.value.chemise = null;
            state.value.pentalon = null;
            state.value.botte = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;