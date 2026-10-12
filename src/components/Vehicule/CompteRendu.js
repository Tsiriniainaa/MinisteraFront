import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Nav from "../Nav/Nav";
import VehiculeService from "./Vehicule.service";
import './styles.css';
export default function CompteRendu() {
    const [date, setDate] = useState('');
    const [flotte,setFlotte] = useState('');
    const [dateSearh, setDateSearh] = useState(new Date().toDateString());
    const [listRendu, setListRendu] = useState([]);
    const [affiche, setAffiche] = useState(false);
    const [total,setTotal] =useState([]);    
    const recherche = ()=>{
        VehiculeService.getCompteRendue({date:dateSearh},(data)=>{
            setDate(VehiculeService.afficheDate(new Date(dateSearh)));
            setListRendu(data);
        },(error)=>{});
        VehiculeService.getCompteRendueTotal({date:dateSearh},(data)=>{
            setTotal(data);
        },(error)=>{})
    }

    useEffect(() => {
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
                                Compte-rendu de tableau de données
                                <br />Date : <span style={{ color: 'gray' }}>{date}</span>
                            </div>
                        </div>

                        <div className="col-12" style={{ backgroundColor: "white", padding: '10px' }}>
                            {/*<!--FILTRE--->*/}
                            <div className="row g-3">
                                <div class="col-md-3">
                                    <div class="form-floating">
                                        <input type="date" class="form-control" id="floatingDate" placeholder="Date" value={dateSearh} onChange={e=>{setDateSearh(e.target.value)}} />
                                        <label for="floatingName"><span className="style-label">Date</span></label>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                <div class="d-grid gap-2 mt-3">
                                    <button type="button" class="btn btn-outline-primary" onClick={e=>{recherche()}}>Filtrer</button>
                                </div>
                                </div>
                                
                            </div>
                            {/*<!--FIN-FILTRE--->*/}
                            <div class="table-responsive">
                                <table class="table table-bordered" style={{ marginTop: '5px' }}>
                                    <thead>
                                        <tr style={{backgroundColor:'#eea74a'}}>
                                        <th scope="col">Immatriculation</th>
                                        <th scope="col">Durée de roulage</th>
                                        <th scope="col">Distance parcourue</th>
                                        <th scope="col">Carbuarant utilisé</th>
                                        <th scope="col">Nb de voyage</th>
                                        <th scope="col">volume ordure enlevé (m3)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listRendu.length > 0 && listRendu.map(row=>{
                                            return(
                                                <>
                                                    <tr>
                                                        <td>{row.immatriculation}</td>
                                                        <td>{row.duree_roulage}</td>
                                                        <td style={{textAlign:'center'}}>{row.distance_parcourue} km</td>
                                                        <td style={{textAlign:'center'}}>{row.carburant_utilise}</td>
                                                        <td style={{textAlign:'center'}}>{row.nbre_voyage}</td>
                                                        <td style={{textAlign:'center'}}>{row.volume_ordure}</td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                    {
                                        total.length > 0 && total[0].duree_roulage && total.map(row=>{
                                            return(
                                                <>
                                                    <tr style={{backgroundColor:'#eea74a'}}>
                                                        <th scope="col">TOTAL</th>
                                                        <th>{VehiculeService.affichedureeRoulage(row.duree_roulage)}</th>
                                                        <th style={{textAlign:'center'}}>{row.distance_parcourue} km</th>
                                                        <th style={{textAlign:'center'}}>{row.carburant_utilise}</th>
                                                        <th style={{textAlign:'center'}}>{row.nbre_voyage}</th>
                                                        <th style={{textAlign:'center'}}>{row.volume_ordure}</th>
                                                    </tr>
                                                </>
                                            )
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