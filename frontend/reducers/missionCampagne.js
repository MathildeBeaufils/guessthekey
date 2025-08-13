import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { trackId: '', missionId :'' },
};

export const userSlice = createSlice({
    name: 'missionCampagne',
    initialState,
    reducers: {
        addTrackId: (state, action) => {
            console.log('la: ',action.payload)
            console.log(action.payload.trackId)
            state.value.trackId = action.payload.trackId;
            state.value.missionId = action.payload.missionId;
        },
        deleteTrackId: (state) => {
            state.value.trackId = null;
            state.value.missionId = null;
        },
    },
});

export const { addTrackId, deleteTrackId } = userSlice.actions;
export default userSlice.reducer;