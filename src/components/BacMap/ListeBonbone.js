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

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const center = [-18.865447, 47.519533]


let labelEtatBacs = [
    { labele: 'tout', id: 0 },
    { labele: 'Vide', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'Plein', id: 3 },
    { labele: 'ND', id: 4 },
    { labele: 'TOTAL', id: 5 },
    // { labele: 'Trop Plein', id: 5 },
    // { labele: 'Débordement', id: 6 }
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

export default function ListeBonbone() {



    //--------------------------------------------------------
    const [valuelabelEtatBac, setvaluelabelEtatBac] = useState(0);
    const [valuelabelEtatDebordement, setvaluelabelEtatDebordement] = useState(0);
    //state
    const [data, setData] = useState([]);
    const [bacs, setbac] = useState([]);
    const [debut, setDebut] = useState(new Date());
    const [fin, setFin] = useState(new Date());
    const [finR, setFinR] = useState(new Date());
    const [debutR, setDebutR] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 4); // Soustrait 4 jours
        return date;
    });
    
    const [effectif, seteffectif] = useState([]);
    const [labdata, setLabdata] = useState([]);
    const [labdata2, setLabdata2] = useState([]);
    const [labdata3, setLabdata3] = useState([]);

    let df = JSON.parse(localStorage.getItem('mapView'));
    const [mapType, setMapType] = useState(df);
    const [erreurD, setErreurD] = useState('');
    const [erreurF, setErreurF] = useState('');
    const [zone, setZone] = useState("")
    const [commune, setcommune] = useState("")
    const [points, setpoints] = useState("")
    const [fokontany, setfokontany] = useState("")
    const [district, setdistrict] = useState("")
    const [date, setDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 2); // Soustrait 4 jours
        return date;
    });

    const [header,setheader]=useState(null)
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
    const optionsChart = {
        chart: {
          type: 'column',
          backgroundColor: '#f4f4f4',
        },
        title: {
          text: '',
          style: {
            color: '#333',
            fontSize: '24px',
          },
        },
        xAxis: {
            categories:labdata2.map(row=>row['date']),
            labels: {
            useHTML: true,
            style: {
              color: '#666',
            },
          },
        },
        yAxis: {
          allowDecimals:false,
          title: {
            text: '',
            style: {
              color: '#666',
            },
          },
        },
        series: [
          {
            name: '1 fois / jour',
            data: labdata2.map(row=>Number(row['1foisparjour'])),
            color: 'rgb(246, 109, 0)',
          },
          {
            name: '2 fois / jour',
            data: labdata2.map(row=>Number(row['2foisparjour'])),
            color: 'rgb(245, 181, 3)',
          },
          {
            name: 'puls de 2 fois / jour',
            data: labdata2.map(row=>Number(row['plusde2foisparjour'])),
            color: 'rgb(124, 179, 66)',
          },
        ],
      };

      const dates = labdata3.map(item => item.date_signalement);
      const quantites = labdata3.map(item => parseInt(item.quantitelivre));

      const options = {
        chart: {
          type: 'column',
          backgroundColor: '#f4f4f4',
        },
        title: {
          text: '',
          style: {
            color: '#333',
            fontSize: '24px',
          },
        },
        xAxis: {
            categories:dates,
            labels: {
            useHTML: true,
            style: {
              color: '#666',
            },
          },
        },
        yAxis: {
          allowDecimals:false,
          title: {
            text: '',
            style: {
              color: '#666',
            },
          },
        },
        series: [
          {
            name: 'quantités(m3) livrés',
            data: quantites,
            color: '#059ffd',
          },
        ],
      };

      

    function fetch() {
        let requestFiltre = { district: district, zone: zone, commune: commune, fokontany: fokontany, points: points, dateDebut: date, dateFin: finR }
        // alert("sss")
       // console.log(requestFiltre)

       fetchNombre()
       fetchQuantite()
        ServiceBac.getAllBonbonnes(requestFiltre)
            .then(rep => {
                setLabdata(rep.data.data.map(dt => ({
                    ...dt,
                    niv: labelEtatBacs[dt.etat_in_bac]?.labele || 'Non defini' // Si "labele" n'existe pas, afficher 'Valeur par défaut'
                })));
                setheader((
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <span className="text-xxl text-1000 font-bold" style={{fontWeight:'bold',textAlign:'center'}}>{Number(rep.data.data.length).toLocaleString()} {'Ravitaillements'.toUpperCase()}</span>
                    </div>
                ))
                
                setFin(new Date(finR))
                setDebutR(new Date(date))
            })
            .catch(err => {
                console.log('error', err);
            })
    }
    function fetchNombre() {
        let requestFiltre = { district: district, zone: zone, commune: commune, fokontany: fokontany, points: points, dateDebut: date, dateFin: finR }
        // alert("sss")
       // console.log(requestFiltre)

        ServiceBac.getAllNombreBonbonnes(requestFiltre)
            .then(rep => {
                console.log("nombre",rep.data.data)
                setLabdata2(rep.data.data)
                })
            .catch(err => {
                console.log('error', err);
            })
            
    }
    function fetchQuantite() {
        let requestFiltre = { district: district, zone: zone, commune: commune, fokontany: fokontany, points: points, dateDebut: date, dateFin: finR }

        ServiceBac.getQuantite(requestFiltre)
            .then(rep => {
                console.log("quantite",rep.data.data)
                 setLabdata3(rep.data.data)
                })
            .catch(err => {
                console.log('error', err);
            })
            
    }
    useEffect(() => {
        fetch()

    }, [1])
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
const headerStyle={ backgroundColor: '#0a53be', color: '#fff' };
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
                                Liste de Ravitaillement des bonbonnes
                                <br /> en date du {debutR.toLocaleDateString()} au {fin.toLocaleDateString()}
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
                                        <input type="text" className="form-control" id="district" name="district" placeholder="District" value={district} onChange={(rep) => { filtre(() => { setdistrict(rep.target.value); }) }} />
                                        <label for='nom'>District</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="commune" name="commune" placeholder="Commune" value={commune} onChange={(rep) => { filtre(() => { setcommune(rep.target.value); }) }} />
                                        <label for='nom'>Commune</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="points" name="points" placeholder="Points" value={points} onChange={(rep) => { filtre(() => { setpoints(rep.target.value); }) }} />
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
                                        <label for='nom'>Date debut</label>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ padding: '5px' }}>
                                    <div className='form-floating'>
                                        <input type="date" className="form-control" id="dateFin" name="dateFin" placeholder="dateFin" value={finR} onChange={(rep) => { filtre(() => { setFinR(rep.target.value) }); }} />
                                        <label for='nom'>Date Fin</label>
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
                                <div className="col-md-4">
                                    <div class="d-grid gap-2 mt-3">
                                        <Button variant="outline-success" onClick={() => fetch()}>Filtrer</Button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="d-grid gap-2 mt-3">
                                        <Button variant="outline-primary" onClick={() => ExportToExcel()}>Exporter excel</Button>
                                    </div>
                                </div>
                                {/* </Col> */}
                            </Row>
                            <br /><br />
                            <Row>
                            <Col md={6}>
                            <HighchartsReact highcharts={Highcharts} options={optionsChart} />
                            </Col>
                            <Col md={6}>
                            <HighchartsReact highcharts={Highcharts} options={options} />
                            </Col>
                                <Col md={12}>
                                    <div id="exportable-table">
                                        <DataTable value={labdata} header={header} scrollable scrollHeight="500px" showGridlines size={'medium'} tableStyle={{ minWidth: '50rem' }}>
                                            <Column field="numero_signalement" header="CODE" sortable headerStyle={headerStyle}></Column>
                                            <Column field="zones" header="ZONE" sortable headerStyle={headerStyle}></Column>
                                            <Column field="district" header="DISTRICT" sortable headerStyle={headerStyle}></Column>
                                            <Column field="localisation" header="POINTS" sortable headerStyle={headerStyle}></Column>
                                            <Column field="commune" header="COMMUNE" sortable headerStyle={headerStyle}></Column>
                                            <Column field="fokontany" header="Fokontany" sortable headerStyle={headerStyle}></Column>
                                            <Column field="date_signalement" header="Date Ravitaillement" sortable headerStyle={headerStyle}></Column>
                                            <Column field="heure_signalement" header="Heure Ravitaillement" sortable headerStyle={headerStyle}></Column>
                                            <Column field="niv" header="Niveau bonbonne" sortable headerStyle={headerStyle}></Column>
                                                    
                                               
                                        </DataTable>
                                        {/* <table className="beautiful-table">
                                            <thead>
                                                <tr>
                                                    <th colSpan={8}>{Number(labdata.length).toLocaleString()} Ravitaillements</th>
                                                </tr>
                                                <tr>
                                                <th>CODE</th>
                                                    <th>ZONE</th>
                                                    <th>DISTRICT</th>
                                                    <th>POINTS</th>
                                                    <th>COMMUNE</th>
                                                    <th>FOKONTANY</th>
                                                    <th>Date Ravitaillement</th>
                                                    <th> </th>
                                                    <th>Niveau bonbonne</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    labdata && labdata.map(dt => {
                                                        return (
                                                            <tr>
                                                                <td >{dt.numero_signalement}</td>
                                                                
                                                                <td >{dt.zones}</td>
                                                                <td >{dt.district}</td>
                                                                <td >{dt.localisation}</td>
                                                                <td >{dt.commune}</td>
                                                                <td >{dt.fokontany}</td>
                                                                <td data-t="s">{dt.date_signalement}</td>
                                                                <td data-t="s">{dt.heure_signalement}</td>
                                                                <td data-t="s">{labelEtatBacs[dt.etat_in_bac].labele}</td>
                                                                
                                                            </tr>
                                                        );
                                                    }

                                                    )
                                                }
                                            </tbody>
                                        </table> */}
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
