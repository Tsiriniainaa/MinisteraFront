import { createSlice } from '@reduxjs/toolkit';

const initialState = [
    // {
    //     debut:null,
    //     fin:null,
    //     priority: '',
    //     description: '',
    //     output: '',
    // }
]

export const tacheSlice = createSlice({
    name: 'tache',
    initialState,

    reducers:{
        addTache: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
        //add petit a petit    
            // state.debut = action.payload.debut
            // state.fin = action.payload.fin
            // state.priority = action.payload.priority
            // state.description = action.payload.description
            // state.output = action.payload.output
         let newData= action.payload;
         state.push(newData);
        },
    }
})
export const { addTache } = tacheSlice.actions

export default tacheSlice.reducer