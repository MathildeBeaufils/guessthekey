import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { round1: [],round2: [],round3: [],round4: [],round5: []},
};

export const userSlice = createSlice({
    name: 'creatRound',
    initialState,
    reducers: {
        addRound: (state, action) => {
            // besoin de deux parametres: number et le tableau: artiste musique id artiste
            console.log('dans le reducer ', action.payload)
            state.value. round[action.payload.number] = action.payload.round[action.payload.number];

        },
        umptyRound: (state) => {
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
    },
});

export const { addRound, umptyRound } = userSlice.actions;
export default userSlice.reducer;