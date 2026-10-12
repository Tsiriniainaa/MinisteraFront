// import http from "./http-common";
import axios from "axios";
import backUrl from '../config/config'
export const AuthService = {

    signin: (data) => {
        return axios.post(backUrl + `/api/auth/signin`, data);
    },
    signup: (data) => {
        // console.log(backUrl + `/api/auth/signin`);
        return axios.post(backUrl + `/api/auth/signup`, data);
    },
    logout: () => {
        // return axios.get(`planning/all-detail-planning`)
    },

    getAllUser: () => {
        // console.log('asdasdasdasdasdasdasd');
        return axios.get(backUrl + `/api/auth/allUser`);
    },

    activation: (data) => {
        // console.log('asdasdasdasdasdasdasd');
        return axios.post(backUrl + `/api/auth/activation`, { email: data });
    },
    udpateUser: (data) => {
        // console.log('asdasdasdasdasdasdasd');
        return axios.post(backUrl + `/api/auth/updateUser`, data);
    },
}
export default AuthService;