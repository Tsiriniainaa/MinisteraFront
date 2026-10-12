import axios from "axios";
import backUrl from '../config/config.js'

export const serviceCamion = {
    insert: (data) => {
        console.log('hahahha', data);
        return axios.post(backUrl + `/api/camion/insert`, data);
    },
    insert_resume: (data) => {
        console.log('hahahha', data);
        return axios.post(backUrl + `/api/camion/insert_resume`, data);
    },
}

export default serviceCamion;