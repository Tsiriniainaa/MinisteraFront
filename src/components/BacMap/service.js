import axios from "axios";
import backUrl from '../config/config.js'

export const ServiceBac = {
    //api/bac/bonbonnes
    getAllBonbonnes: (data) => {
        return axios.post(backUrl + `/api/bac/bonbonnes`, data);
    },    
    getAllNombreBonbonnes: (data) => {
        return axios.post(backUrl + `/api/bac/bonbonnes-jour`, data);
    },    
    getAllPOintsSituation: (data) => {
        // console.log('hahahha', data);
        return axios.post(backUrl + `/api/points/situation`, data);
    },
    getStatistiquePointsSituation: (data) => {
        // console.log('hahahha', data);
        return axios.post(backUrl + `/api/points/statistique`, data);
    },
    getAllDonneeCartographique: (data) => {
        // console.log('hahahha', data);
        return axios.post(backUrl + `/api/data/carteplanification`, data);
    },
    isValide : (date)=>{
        return axios.post(backUrl + `/api/bac/validation`, {date:date});
    },
    getEvolutionStatistique : (data)=>{
        return axios.post(backUrl + `/api/bac/evolution/statistique`, data);
    },
    getData : (data) => {
        // console.log('hahahha', data);
        return axios.post(backUrl + `/api/bac/evolution`, data);
    },
    getAllBac: (data) => {
        // console.log('hahahha', data);
        return axios.post(backUrl + `/api/bac/`, data);
    },
    insert: (data) => {
        console.log('hahahha', data);
        return axios.post(backUrl + `/api/data/insert`, data);
    },
    getQuantite: (data) => {
        return axios.post(backUrl + `/api/bac/bonbonnes_quantite`, data);
    },
}

export default ServiceBac;