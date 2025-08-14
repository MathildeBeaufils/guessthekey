import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { trackId: '', missionId :'', points: '' },
};

export const userSlice = createSlice({
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

export const { addTrackId, deleteTrackId, addPoints } = userSlice.actions;
export default userSlice.reducer;