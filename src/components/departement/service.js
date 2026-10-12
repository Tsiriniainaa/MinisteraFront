// import http from "./http-common";
import axios from "axios";
// localhost: 8080 / api / auth / signin
import backUrl from '../config/config';
export const Service = {

    
    getAllByDept: (DepartementId) => {
        return axios.get(backUrl + `/api/projet/ProjetByDept/${DepartementId}`);
    },
    getAllDept: () => {
        return axios.get(backUrl + `/api/departement`);
    }
    
}
export default Service;