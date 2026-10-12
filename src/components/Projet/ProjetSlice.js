// import { createSlice,  createAsyncThunk, current } from '@reduxjs/toolkit';
// import ServiceProjet from '../Projet/Projet.service';

// const initialState ={
//     data:[],
//     nakaBase: false
// }

// ///fonction api
// export const getProjetThunk = createAsyncThunk(
//     "getProjetThunk",
//     async (data) => {
//       const res = await ServiceProjet.getAll();
//       return res.data;
//     }
// );

// export const saveProjetThunk = createAsyncThunk(
//     "projet/save",
//     async (data) => {
//       const res = await ServiceProjet.save(data);
//       return res.data;
//     }
// );

// /////creates slice
// export const projetSlice = createSlice({
//     name: 'projet',
//     initialState,
//     //local//////////////
//     reducers:{

//         setNakaBase:(state)=>{
//             state.nakaBase = true;
//         },

//         getAllProjet:(state, action)=>{
//             let newData= action.payload;
//             state.data.push(newData);
//             // ServiceProjet.save(newData);
//         },

//         addProjet: (state, action) => {
//          let newData= action.payload;
//          state.data.push(newData);
//         //  ServiceProjet.save(newData);
//         },
//     },
//     ///////////asynchrone
//     extraReducers: {
//         //change status
//         [getProjetThunk.fulfilled]: (state, { payload }) => {
//             state = payload;
//         },

//         [saveProjetThunk.fulfilled]: (state, action) => {
//             let newData =  action.meta.arg ;
//             state.push(newData);
//         }
//     }
// })

// export const { addProjet, setNakaBase } = projetSlice.actions
// export default projetSlice.reducer