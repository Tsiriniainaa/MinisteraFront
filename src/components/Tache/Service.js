// import http from "./http-common";
import axios from "axios";
// localhost: 8080 / api / auth / signin
import backUrl from '../config/config';
export const TacheService = {

    getGantt: (idDepartement) => {
        // let datas = { departementId: data }
        // console.log('asd', datas);
        return axios.get(backUrl + `/api/gantt/${idDepartement}`);
    },
    /////////retard
    getTacheByDept: (idDepartement) => {
        // tableau de tache
        // return axios.get(backUrl + `/api/taches/updateRetard`, tacheRetard);


        return axios.get(backUrl + `/api/tache/byDept/${idDepartement}`)
    },

    updateRetard: (tacheRetard) => {
        // tableau de tache
        return axios.put(backUrl + `/api/tache/updateRetard`, tacheRetard);
    },
    ///////////////tache
    save: (data) => {
        return axios.post(backUrl + `/api/tache/add`, data);

    },
    getAll: () => {
        return axios.get(backUrl + `/api/taches`);
    },

    getTacheByIdProjet: (id_Projet) => {
        return axios.get(backUrl + `/api/tache/ByIdProjet/${id_Projet}`)
    },

    update: (data) => {
        return axios.put(backUrl + `/api/tache/update`, data)
    },
    delete: (data) => {
        console.log('==', data);
        return axios.post(backUrl + `/api/tache/delete`, data)
    },
    ///================Commentaire
    saveCommentaire: (data) => {
        console.log('HAHAHA', data)
        return axios.post(backUrl + `/api/commentaire/save`, data)
    },

    getCommentaireBytache: (TacheId) => {
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhuhuhu', { TacheId });
        return axios.get(backUrl + `/api/commentaireByTache/${TacheId}`)
    },
    /////////////////sousTache
    getSousTacheByTache: (TacheId) => {
        return axios.get(backUrl + `/api/sousTacheByTache/${TacheId}`)
    },

    saveSousTache: (data) => {
        return axios.post(backUrl + `/api/sousTache/save`, data);
    },
    setCheck: (data) => {
        return axios.put(backUrl + `/api/sousTache/update`, data);
    },
    getAvancement: (data) => {
        return axios.get(backUrl + `/api/sousTache/avancement/${data}`);
    },

    endAllChecklist: (data) => {
        return axios.put(backUrl + `/api/sousTache/endAllChecklist/${data}`);
    },
    ////////////////////////probleme
    saveProbleme: (data) => {
        return axios.post(backUrl + `/api/problemeTache/save`, data);
    },
    getProbleme: (data) => {
        return axios.get(backUrl + `/api/problemeTache/${data}`);
    },

    getOptionProbleme: () => {
        return axios.get(backUrl + `/api/problemeOption`);
    },
}
export default TacheService;