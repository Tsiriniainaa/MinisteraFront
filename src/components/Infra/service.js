import axios from "axios";
import backUrl from '../config/config.js'

export const ServiceInfra = {
    getAllInfra: () => {
        return axios.get(backUrl + `/api/infra/AllInfra`);
    },
}

export default ServiceInfra;