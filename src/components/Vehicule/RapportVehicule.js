import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Nav from "../Nav/Nav";
import { VehiculeService } from "./Vehicule.service";
import './styles.css';
const moment = require('moment');
export default function RapportVehicule() {
    const [immatricule, setImmatricule] = useState('');
    const [chaffeur, setChauffeur] = useState('');
    const [date, setDate] = useState('');
    const [immatriSearh, setimmatriSearh] = useState('');
    const [dateSearh, setDateSearh] = useState(new Date().toLocaleDateString());
    const [listRapport, setListRapport] = useState([]);
    const [affiche, setAffiche] = useState(false);
    const [vehicules,setVehicules] = useState([]); 

    const recherche = () => {
        setDate('')
        setChauffeur('')
        VehiculeService.getRapportVehicule({ date: dateSearh, immatricule: immatriSearh },
            (data) => {
                setListRapport(data);
                setDate(VehiculeService.afficheDate(new Date(dateSearh)));
                setImmatricule(immatriSearh);
                if(data.length > 0){
                    setChauffeur(data[0].chauffeur);
                }
            }, (error) => { });
    }
    const getListeVehicule = ()=>{
        VehiculeService.getListeVehicule((data)=>{
            setVehicules(data);
        },(error)=>{});
    }
    useEffect(() => {
        getListeVehicule();
        recherche();
    }, 1)

    return (
        <div>
            <Row className='container-fluid'>
                <Col md={2}>
                    <Nav></Nav>
                </Col>
                <Col md={10} className="style-body">
                    <Col md={12} className="bg-white filtre" >
                        <div className='title'>
                            <div className='title_style'>
                                Rapport d'activités
                                <br />véhicule : <span style={{ color: 'gray' }}>{immatricule}</span>
                                <br />date génération : <span style={{ color: 'gray' }}>{date}</span>
                            </div>
                        </div>

                        <div className="col-12" style={{ backgroundColor: "white", padding: '10px' }}>
                            {/*<!--FILTRE--->*/}
                            <div className="row g-3">
                                <div class="col-md-3">
                                    <div class="form-floating">
                                        <input type="date" class="form-control" id="floatingDate" placeholder="Date" value={dateSearh} onChange={e=>{setDateSearh(e.target.value)}} />
                                        <label for="floatingName"><span className="style-label">Date génération</span></label>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-floating">
                                        <select value={immatriSearh} class="form-select" id="floatingSelect" aria-label="State" onChange={e=>{setimmatriSearh(e.target.value)}}>
                                            <option value={''}></option>
                                            {
                                                vehicules && vehicules.map(row=>{
                                                    return(
                                                        <option value={row.immatricule}>{row.immatricule}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                        <label for="floatingSelect"><span className="style-label">Choisir véhicule</span></label>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                <div class="d-grid gap-2 mt-3">
                                    <button type="button" class="btn btn-outline-primary" onClick={e=>{recherche()}}>Filtrer</button>
                                </div>
                                </div>
                                <div class="col-md-2" style={{textAlign:'right'}}>
                                <div class="d-grid gap-2 mt-3">
                                    {
                                        affiche === false &&(
                                            <>
                                                <button type="button" class="btn btn-outline-danger" onClick={e=>{setAffiche(true)}}>affiche plus</button>        
                                            </>
                                        )
                                    }
                                    {
                                        affiche === true &&(
                                            <>
                                                <button type="button" class="btn btn-outline-danger" onClick={e=>{setAffiche(false)}}>affiche moins <i class="bi bi-dash-square-fill"></i></button>        
                                            </>
                                        )
                                    }
                                    </div>
                                </div>
                            </div>
                            {/*<!--FIN-FILTRE--->*/}
                            <div class="table-responsive">
                                <table class="table table-bordered" style={{ marginTop: '5px' }}>
                                    <thead>
                                        <tr style={{backgroundColor:'#eea74a'}}>
                                            <th scope="col">Événement</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Lieux</th>
                                            {
                                                affiche && (
                                                    <>
                                                        <th scope="col">Latitude</th>
                                                        <th scope="col">Longitude</th>
                                                        <th scope="col">Localisation</th>

                                                    </>
                                                )
                                            }
                                            <th scope="col">Durée</th>
                                            <th scope="col">Distance parcourue</th>
                                            <th scope="col">Vitesse moyenne</th>
                                            <th scope="col">Vitesse maximale</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listRapport.length > 0 && listRapport.map(row => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>{row.evenement}</td>
                                                            <td>{moment(row.date_evenement).format('DD/MM/YYYY HH:mm:ss')}</td>
                                                            <td>{row.lieux}</td>
                                                            {
                                                                affiche && (
                                                                    <>
                                                                        <td>{row.latitude}</td>
                                                                        <td>{row.longitude}</td>
                                                                        <td>{row.localisation}</td>
                                                                    </>
                                                                )
                                                            }
                                                            <td>{row.duree}</td>
                                                            <td>{row.distance_parcourue} km</td>
                                                            <td>{row.vitesse_moyenne} km/h</td>
                                                            <td>{row.vitesse_maximal} km/h</td>
                                                        </tr>
                                                    </>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </Col>
                </Col>
            </Row>
        </div>
    )
}