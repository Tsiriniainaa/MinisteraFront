// import http from "./http-common";
import axios from "axios";
// localhost: 8080 / api / auth / signin
import backUrl from '../config/config'
export const ProjetService = {
    getProbleme: () => {
        return axios.get(backUrl + `/api/dash/probleme`);
    },
    getAvanceRetard: () => {
        return axios.get(backUrl + `/api/dash/retardavance`);
    },
    getEffectif: () => {
        return axios.get(backUrl + `/api/dash/effectif`);
    },
    tracageAvance: () => {
        return axios.get(backUrl + `/api/dash/tracageAvance`);
    },
    tracageRetard: () => {
        return axios.get(backUrl + `/api/dash/tracageRetard`);
    }

}

export default ProjetService;