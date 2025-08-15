import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { trackId: '', missionId :'', points: '' },
};

export const missionSlice = createSlice({
    name: 'missionCampagne',
    initialState,
    reducers: {
        addTrackId: (state, action) => {
            state.value.trackId = action.payload.trackId;
            state.value.missionId = action.payload.missionId;
        },
        deleteTrackId: (state) => {
            state.value.trackId = null;
            state.value.missionId = null;
            state.value.points = null;
        },
        addPoints:(state, action) => {
            console.log('la: ',action.payload)
            state.value.points += action.payload.points;
        },
    },
});

export const { addTrackId, deleteTrackId, addPoints } = missionSlice.actions;
export default missionSlice.reducer;