import axios from "axios";
import backUrl from '../config/config.js';

function analyseChiffre(ch){
    let a = ""+ch;
    if(a.length === 1){
        a = "0"+a;
    }
    return a;
}
export const VehiculeService = {
    
    affichedureeRoulage : (dureeRoulage)=>{
        let d = "";
        if(dureeRoulage.hours !== '' && dureeRoulage.hours !== undefined){
            d = d +  analyseChiffre(dureeRoulage.hours) + ":";
        }else{
            d = d + "00:"
        }
        if(dureeRoulage.minutes !== '' && dureeRoulage.minutes !== undefined){
            d = d +  analyseChiffre(dureeRoulage.minutes) + ":";
        }else{
            d = d + "00:"
        }
        if(dureeRoulage.seconds !== '' && dureeRoulage.seconds !== undefined){
            d = d +  analyseChiffre(dureeRoulage.seconds) + "";
        }else{
            d = d + "00"
        }
        return d;
    },
    
    getCompteRendueTotal : (data,setData,afficheError)=>{
        //alert(JSON.stringify(data))
        axios.post(backUrl + `/api/compte-rendu-total`, data)
        .then(response=>{
            setData(response.data);
        }).catch(error=>{
            
            afficheError(error);
        });
    },
    getCompteRendue : (data,setData,afficheError)=>{
        //alert(JSON.stringify(data))
        axios.post(backUrl + `/api/compte-rendu`, data)
        .then(response=>{
            setData(response.data);
        }).catch(error=>{
            
            afficheError(error);
        });
    },
    getRapportVehicule : (data,setData,afficheError)=>{
        //alert(JSON.stringify(data))
        axios.post(backUrl + `/api/rapport`, data)
        .then(response=>{
            setData(response.data);
        }).catch(error=>{
            
            afficheError(error);
        });
    },
    getListeVehicule : (setData,afficheError)=>{
        axios.get(backUrl + `/api/vehicule`)
        .then(response=>{
            setData(response.data);
        }).catch(error=>{
            afficheError(error);
        });
    },
    afficheDate: (date) => {
        let joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        let mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        let jourSemaine = joursSemaine[date.getDay()];
        let jour = date.getDate();
        let moisActuel = mois[date.getMonth()];
        let annee = date.getFullYear();
        let dateFormatee = jourSemaine + " " + (jour < 10 ? '0' : '') + jour + " " + moisActuel + " " + annee;
        return dateFormatee;
    }
}

export default VehiculeService;