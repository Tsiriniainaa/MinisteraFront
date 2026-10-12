// import http from "./http-common";
import axios from "axios";
// localhost: 8080 / api / auth / signin
import backUrl from '../config/config'
export const ParametreService = {
    setConfigPriority: () => {
        return axios.post(backUrl + `/api/config`);
    },
}

export default ParametreService;