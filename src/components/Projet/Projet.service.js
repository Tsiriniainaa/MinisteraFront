// import http from "./http-common";
import axios from "axios";
// localhost: 8080 / api / auth / signin
import backUrl from '../config/config';
export const ProjetService = {

    save: (data) => {
        console.log(data);
        return axios.post(backUrl + `/api/projet/AjoutProjet`, data);
    },

    getAllByDept: (DepartementId) => {
        return axios.get(backUrl + `/api/projet/ProjetByDept/${DepartementId}`);
    },
    getAvancement: () => {
        return axios.get(backUrl + `/api/projet/avancement`)
    }

}
export default ProjetService;