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
import { Button, Col, Form, Row, Modal } from 'react-bootstrap';
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

export default function TableauPointsbackups() {



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
    const [data2, setdata2] = useState([]);
    let df = JSON.parse(localStorage.getItem('mapView'));
    const [mapType, setMapType] = useState(df);
    const [erreurD, setErreurD] = useState('');
    const [erreurF, setErreurF] = useState('');
    const [zone, setZone] = useState("")
    const [commune, setcommune] = useState("")
    const [fokontany, setfokontany] = useState("")
    const [date, setDate] = useState(new Date())
    const [nombre, setNombre] = useState("")
    const [heure, setHeure] = useState("")
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
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const options = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Répartition des niveaux avec date et heure',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>Nombre : {point.y} <br> Nombre bidon : {point.nombrebidon}',
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} % ({point.y})',
                },
                point: {
                    events: {
                        click: function () {
                            fetchdata2(this.name)
                            //  alert("skjskjs")
                            // $('#exampleModal').modal('show');
                        }
                    }
                }
            },
        },
        series: [
            {
                name: 'Niveau',
                colorByPoint: false,
                data: labdata.map(item => ({ name: item.name, y: Number(item.y),color: item.color,nombrebidon:item.nombrebidon  })),
            },
        ],
    };

    function fetch() {
        let requestFiltre = { dates: date, heure: heure }

        ServiceBac.getStatistiquePointsSituation(requestFiltre)
            .then(rep => {
                console.log(rep)
                console.log(JSON.stringify(rep.data.data))
                setLabdata(rep.data.data)
            })
            .catch(err => {
                console.log('error', err);
            })
    }

    function fetchdata2(niveau) {
        setdata2([])
        let requestFiltre = { niveau:niveau,dates:date, heure: heure }
        ServiceBac.getAllPOintsSituation(requestFiltre)
            .then(rep => {
                console.log(JSON.stringify(rep.data.data))
                setdata2(rep.data.data)
                handleShow()
            })
            .catch(err => {
                console.log('error', err);
            })
    }
    useEffect(() => {
        fetch()
    }, 1)
    function filtre(set) {
        set()
        fetch()
    }

    const ExportToExcel = () => {
        const element = document.getElementById('exportable-table');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(element);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'tableau_points_situation.xlsx');

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
                                Points de situation des bonbonnes
                            </div>
                            <Row className='p-3 d-flex justify-content-around' style={{ backgroundColor: 'white' }}>
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="date" className="form-control" id="date" name="date" placeholder="Date" value={date} onChange={(rep) => { filtre(() => { setDate(rep.target.value) }); }} />
                                        <label for='nom'>Date</label>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className='form-floating'>
                                        <input type="time" className="form-control" id="heure" name="heure" placeholder="Heure" value={heure} onChange={(rep) => { filtre(() => { setHeure(rep.target.value) }); }} />
                                        <label for='nom'>Heure</label>
                                    </div>
                                </div>
                            </Row>
                            <br /><br />
                            <Row>
                                <Col md={12}>
                                    <HighchartsReact highcharts={Highcharts} options={options} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row >
            <div>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Nombre : {Number(data2.length).toLocaleString()} points</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Contenu de la modale */}
                        <div id="exportable-table" className="table-container-2">
                            <table className="beautiful-table">
                                <thead>
                                    <tr>
                                    <th>Code</th>
                                        <th>Zone</th>
                                        <th>Cap-m3</th>
                                        <th>Points</th>
                                        <th>Commune</th>
                                        <th>Fokontany</th>
                                        <th>date</th>
                                        <th>heure</th>
                                        <th>nombre de bidon jaune</th>
                                        <th>Niveau d'eau</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data2 && data2.map(dt => {
                                            return (
                                                <tr>
                                                    <td >{dt.code}</td>
                                                    <td >{dt.zones}</td>
                                                    <td >{dt.cap}</td>
                                                    <td >{dt.points}</td>
                                                    <td >{dt.commune}</td>
                                                    <td >{dt.fokontany}</td>
                                                    <td >{dt.dates}</td>
                                                    <td >{dt.heure}</td>
                                                    <td >{dt.nombrebidon}</td>
                                                    <td >{dt.niveaunom}</td>
                                                    {/* <td>{evolution.effectif[0]}</td> */}
                                                </tr>
                                            );
                                        }

                                        )
                                    }
                                </tbody>
                            </table>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={ExportToExcel}>
                            Export Excel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >



    )
}
