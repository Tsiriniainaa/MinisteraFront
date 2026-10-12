import { React, useEffect, useState } from 'react';
import { Radio } from 'antd';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useMap, MapContainer, Marker, Popup, TileLayer, LayersControl } from 'react-leaflet'
import './styles.css';
import 'leaflet/dist/leaflet.css';
import './tableauBac.css';
import { Control, Icon, Layer } from 'leaflet';
import ServiceBac from './service';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav'
import Legende from './Legende';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


const center = [-18.865447, 47.519533]



let labelEtatBac = [
    { labele: '1 par jour', id: 0, couleur: 'orange' },
    { labele: '2 par jours', id: 1, couleur: 'red' },
    { labele: '1 par 2 jours', id: 2, couleur: 'yellow' }
];
const options = { year: 'numeric', month: 'long', day: 'numeric' };
let labelEtatDebordement = [
    { labele: 'tout', id: 0 },
    { labele: 'Quart', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'trois quart', id: 3 },
    { labele: 'Plein', id: 4 },
    { labele: 'Trop Plein', id: 5 },
    { labele: 'Débordement', id: 6 }
];


const getDate = function (labdata) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let dates = [];
    for (let i = 0; i < labdata.length; i++) {
        dates.push(new Date(labdata[i].date).toLocaleDateString('fr-FR', options));
    }
    return dates;
};

const getAll = function (labdata) {
    let all = []; let tout = []; let quart = []; let demi = []; let trois_quart = []; let plein = [];
    let trop_plein = []; let debordement = []; let totalBonbone = []; let nondef = [];
    for (let i = 0; i < labdata.length; i++) {
        tout.push(labdata[i].effectif[0]);
        quart.push(labdata[i].effectif[1]);
        demi.push(labdata[i].effectif[2]);
        trois_quart.push(labdata[i].effectif[3]);
        plein.push(labdata[i].effectif[4]);
        trop_plein.push(labdata[i].effectif[5]);
        debordement.push(labdata[i].effectif[6]);
        totalBonbone.push(labdata[i].effectif[9]);
        nondef.push(labdata[i].effectif[8]);
    }

    all.push(tout);
    all.push(quart);
    all.push(demi);
    all.push(trois_quart);
    all.push(plein);
    all.push(trop_plein);
    all.push(debordement);

    all.push(nondef);
    all.push(totalBonbone);
    return all;
}

export default function TableauPlanification() {



    //--------------------------------------------------------
    const [valuelabelEtatBac, setvaluelabelEtatBac] = useState(0);
    const [valuelabelEtatDebordement, setvaluelabelEtatDebordement] = useState(0);
    //state
    const [data, setData] = useState([]);
    const [bacs, setbac] = useState([]);
    const [debut, setDebut] = useState(new Date());
    const [fin, setFin] = useState(new Date());
    const [finR, setFinR] = useState(new Date());
    const [debutR, setDebutR] = useState(new Date());
    const [effectif, seteffectif] = useState([]);
    const [labdata, setLabdata] = useState([]);
    let df = JSON.parse(localStorage.getItem('mapView'));
    const [mapType, setMapType] = useState(df);
    const [erreurD, setErreurD] = useState('');
    const [erreurF, setErreurF] = useState('');
    const [zone, setZone] = useState("")
    const [commune, setcommune] = useState("")
    const [district, setdistrict] = useState("")
    const [points, setpoints] = useState("")
    const [fokontany, setfokontany] = useState("")
    const [date, setDate] = useState(new Date())
    const [nombre, setNombre] = useState("")

    function analyseDate(date, setDate, setErreur) {
        setErreur('');
        setDate(date);
        ServiceBac.isValide(date)
            .then(rep => {
                setErreur(rep.data.erreur);
            }).catch(err => {
                console.log('error', err);
            })
    }

    function fetch() {
        let requestFiltre = { points:points,district:district,zone: zone, commune: commune, fokontany: fokontany, date: date, nombre: nombre }

        ServiceBac.getAllDonneeCartographique(requestFiltre)
            .then(rep => {
                setLabdata(rep.data.data);
            })
            .catch(err => {
                console.log('error', err);
            })
    }
    useEffect(() => {
        fetch()
    },[1])
    function filtre(set) {
        set()
        fetch()
    }

    const ExportToExcel = () => {
        const element = document.getElementById('exportable-table');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(element);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'tableau_planification.xlsx');

    }

    //view  
    return (
        <div>
            <Row className='container-fluid'>
                <Col md={2}>
                    <Nav></Nav>
                </Col>
                <Col md={10} className={''}>
                    <Row>
                        <Col md={12} className="bg-white filtre">
                            {/* filtre */}
                            <div className='title_style'>
                                Zonages des bonbonnes
                            </div>
                            <Row className='p-3 d-flex justify-content-around' style={{ backgroundColor: 'white' }}>

                                {/* <Col md={12} className="d-flex justify-content-around"> */}
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="zone" name="zone" placeholder="Zone" value={zone} onChange={(rep) => { filtre(() => { setZone(rep.target.value) }); }} />
                                        <label for='nom'>Zone</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="district" name="district" placeholder="District" value={district} onChange={(rep) => { filtre(() => { setdistrict(rep.target.value) }); }} />
                                        <label for='nom'>District</label>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="points" name="points" placeholder="Commune" value={points} onChange={(rep) => { filtre(() => { setpoints(rep.target.value) }); }} />
                                        <label for='nom'>Commune</label>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="commune" name="commune" placeholder="Points" value={commune} onChange={(rep) => { filtre(() => { setcommune(rep.target.value); }) }} />
                                        <label for='nom'>Points</label>
                                    </div>
                                </div>

                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="fokontany" name="fokontany" placeholder="fokontany" value={fokontany} onChange={(rep) => { filtre(() => { setfokontany(rep.target.value) }); }} />
                                        <label for='nom'>Fokontany</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="date" className="form-control" id="date" name="date" placeholder="Date" value={date} onChange={(rep) => { filtre(() => { setDate(rep.target.value) }); }} />
                                        <label for='nom'>Date de Ravitaillements</label>
                                    </div>
                                </div>
                                <div className="col-md-4" style={{padding:'5px'}}>
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Nombre" value={nombre} onChange={(rep) => { filtre(() => { setNombre(rep.target.value) }); }} />
                                        <label for='nom'>Nombre de Ravitaillements</label>
                                    </div>
                                </div>
                                {/* <Row>
                                         <DateTimePicker className="dateCss" onChange={(event)=> analyseDate(event,setDebut,setErreurD)} value={debut} />
                                        {erreurD !=='' &&
                                             <div className='erreur'>
                                                {erreurD}
                                           </div>  
                                        }
                                    </Row>
                                    <Row>
                                    <DateTimePicker className="dateCss" onChange={(event)=> analyseDate(event,setFin,setErreurF)} value={fin} />
                                    {erreurF !=='' &&
                                             <div className='erreur'>
                                                {erreurF}
                                           </div>  
                                        }
                                        </Row>
                                        {erreurF =='' && erreurD =='' && 
                                            <>
                                            <Button variant="outline-success" onClick={()=>fetch(0)}>Filtrer</Button>
                                            <Button variant="outline-primary" onClick={()=>fetch(1)}>Tout la journée</Button>
                                            <Button variant="outline-primary" onClick={()=>ExportToExcel ()}>Exporter excel</Button>
                                            </>
                                        }
                                        {erreurF !='' || erreurD !='' && 
                                            <>
                                            <Button variant="outline-success" onClick={()=>fetch(0)} disabled={true}>Filtrer</Button>
                                            <Button variant="outline-primary" onClick={()=>fetch(1)} disabled={true}>Tout la journée</Button>
                                            <Button variant="outline-primary" onClick={()=>ExportToExcel ()} disabled={true}>Exporter excel</Button>
                                            </>
                                        } */}
                               <div className="col-md-3">
                                    <div class="d-grid gap-2 mt-3">
                                        <Button variant="outline-success" onClick={() => fetch()}>Filtrer</Button>
                                    </div>
                                </div> 
                                <div className="col-md-3">
                                    <div class="d-grid gap-2 mt-3">
                                        <Button variant="outline-primary" onClick={() => ExportToExcel()}>Exporter excel</Button>
                                    </div>
                                </div>
                                {/* </Col> */}
                            </Row>
                            <br /><br />
                            <Row>
                                <Col md={12}>
                                    <div id="exportable-table" className="table-container">
                                        <table className="beautiful-table">
                                            <thead>
                                                <tr>
                                                <th>CODE</th>
                                                    <th>ZONE</th>
                                                    <th>DISTRICT</th>
                                                    <th>COMMUNE</th>
                                                    <th>POINTS</th>
                                                    <th>FOKONTANY</th>
                                                    <th>Cap(m3)_BBN</th>
                                                    <th>ACTIONS</th>
                                                    <th>Ravitaillements effectués</th>
                                                    <th>Date de Ravitaillements</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    labdata && labdata.map(dt => {
                                                        return (
                                                            <tr>
                                                                <td >{dt.code}</td>
                                                                <td >{dt.zones}</td>
                                                                <td >{dt.district}</td>
                                                                <td >{dt.points}</td>
                                                                <td >{dt.commune}</td>
                                                                <td >{dt.fokontany}</td>
                                                                <td >{dt.cap}</td>
                                                                <td style={{ backgroundColor: labelEtatBac[dt.etat_actions].couleur }}>{dt.actions}</td>
                                                                <td >{dt.nombre}</td>
                                                                <td data-t="s">{dt.date}</td>
                                                                {/* <td>{evolution.effectif[0]}</td> */}
                                                            </tr>
                                                        );
                                                    }

                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >



    )
}
