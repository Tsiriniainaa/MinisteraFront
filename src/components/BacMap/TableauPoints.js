import { React, useEffect, useState } from 'react';
import { Radio } from 'antd';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useMap, MapContainer, Marker, Popup, TileLayer, LayersControl, CircleMarker } from 'react-leaflet'
import './styles.css';
import 'leaflet/dist/leaflet.css';
import './tableauBac.css';
import { Control, Icon, Layer } from 'leaflet';
import ServiceBac from './service';
import { Button, Col, Form, Row, Modal, Spinner } from 'react-bootstrap';
import Nav from '../Nav/Nav'
import Legende from './Legende';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import Loaders from './Loaders';


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

function TableauBord({ heure0, date0, etat, autrefitre }) {
    const [labdata, setLabdata] = useState([]);
    const [labdatamap, setlabdatamap] = useState([]);
    const [data2, setdata2] = useState([]);
    const [date, setDate] = useState(date0)
    const [heure, setHeure] = useState(heure0)
    const [show, setShow] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingMap, setLoadingMap] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let options2 = {
        chart: {
            type: 'pie',
        },
        title: {
            text: null, // Désactive l'affichage du titre
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
                data: labdata.map(item => ({ name: item.name, y: Number(item.y), color: item.color, nombrebidon: item.nombrebidon })),
            },
        ],
    };

    function fetch(date, heure) {
        let requestFiltre = { dates: date, heure: heure, ...autrefitre }
        ServiceBac.getStatistiquePointsSituation(requestFiltre)
            .then(rep => {
                console.log("filtre", requestFiltre)

                console.log(rep.data.data)
                setLabdata(rep.data.data)
            })
            .catch(err => {
                console.log('error', err);
            })
        setLoadingMap(true)
        setlabdatamap([])
        ServiceBac.getAllPOintsSituation(requestFiltre).then(rep => {
            console.log("filtre", requestFiltre)

            console.log(rep.data.data)
            setlabdatamap(rep.data.data)
            setLoadingMap(false)
        })
            .catch(err => {
                console.log('error', err);
            })
    }

    function fetchdata2(niveau) {
        setdata2([])
        setLoading(true)

        let requestFiltre = { niveau: niveau, dates: date, heure: heure0, ...autrefitre }
        ServiceBac.getAllPOintsSituation(requestFiltre)
            .then(rep => {
                console.log(JSON.stringify(rep.data.data))
                setdata2(rep.data.data)
                setLoading(false)
                handleShow()
            })
            .catch(err => {
                console.log('error', err);
            })
    }
    useEffect(() => {
        setDate(date0)
        setHeure(heure0)
        fetch(date0, heure0)
    }, [etat])

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
            <Col md={12}>
                <h1>{date ? new Date(date).toLocaleDateString() : "Date non disponible"}</h1>
                <Row>
                    <Col md={5}>
                        {loading ? <Loaders /> :
                            <>
                                <HighchartsReact highcharts={Highcharts} options={options2} />
                            </>
                        }
                    </Col>
                    <Col md={7}>
                        <div style={{ position: 'relative', height: '450px', width: '100%',border:'1px solid gray',borderRadius:'15px' }}>
                            {/* Affichage du loader au centre si loadingMap est true */}
                            {loadingMap && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        zIndex: 1000,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
                                    <p style={{ marginTop: '10px' }}>Chargement de la carte...</p>
                                </div>
                            )}

                            {/* MapContainer avec les marqueurs */}
                            {!loadingMap && (
                                <MapContainer style={{ height: '450px', width: '100%' }} center={center} zoom={11} scrollWheelZoom={true}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {labdatamap.map((dt, index) => (
                                        <CircleMarker
                                            key={index} // Utilisation d'un index comme clé si dt.localisation n'est pas unique
                                            center={[dt.latitude, dt.longitude]}
                                            radius={5}
                                            color={dt.couleur}
                                            fillColor={dt.couleur}
                                            fillOpacity={1}
                                        >
                                            <Popup minWidth={100}>
                                                <p><span style={{ fontWeight: 'bold' }}>Code :</span> {dt.code}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Zone :</span> {dt.zones}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Cap :</span> {dt.cap}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Points :</span> {dt.points}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Commune :</span> {dt.commune}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Fokontany :</span> {dt.fokontany}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Date :</span> {dt.dates}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Heure :</span> {dt.heure}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Nombre bidon jaune :</span> {dt.nombrebidon}</p>
                                                <p><span style={{ fontWeight: 'bold' }}>Niveau d'eau :</span> {dt.niveaunom}</p>
                                            </Popup>
                                        </CircleMarker>
                                    ))}
                                </MapContainer>
                            )}
                        </div>
                    </Col>

                </Row>
            </Col>
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

export default function TableauPoints() {


    const [dataDate, setdataDate] = useState([]);
    const [date, setDate] = useState(new Date())
    const [datefin, setDateFIn] = useState(new Date())
    const [heure, setHeure] = useState("")
    const [etat, setEtat] = useState(1)
    const [zone, setZone] = useState("")
    const [code, setcode] = useState("")
    const [commune, setcommune] = useState("")
    const [points, setpoints] = useState("")
    const [fokontany, setfokontany] = useState("")


    function fetch() {
        const startDate = new Date(date);
        const endDate = new Date(datefin);
        const d = [];
        console.log(startDate, endDate)
        while (startDate <= endDate) {
            let h = heure;
            if (h === '00:00') {
                h = "";
                setHeure(h)
            }
            d.push({
                date: new Date(startDate), heure: h,
                autrefitre: { commune: commune, fokontany: fokontany, zone: zone, code: code, points: points }
            });
            startDate.setDate(startDate.getDate() + 1);
        }
        console.log(d)
        setdataDate(d);
        setEtat(etat + 1);
    }

    useEffect(() => {
        fetch()
    }, [])
    function filtre(set) {
        set()
        fetch()
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
                                Niveau d'eau au niveau des bonbonnes
                            </div>
                            <Row className='p-3 d-flex justify-content-around' style={{ backgroundColor: 'white' }}>
                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input type="date" className="form-control" id="date" name="date" placeholder="Date" value={date} onChange={(rep) => { setDate(rep.target.value) }} />
                                        <label for='nom'>Date Debut</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input type="date" className="form-control" id="datefin" name="datefin" placeholder="Date fin" value={datefin} onChange={(rep) => { setDateFIn(rep.target.value) }} />
                                        <label for='nom'>Date Fin</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className='form-floating'>
                                        <input type="time" className="form-control" id="heure" name="heure" placeholder="Heure" value={heure} onChange={(rep) => { setHeure(rep.target.value) }} />
                                        <label for='nom'>Heure</label>
                                    </div>
                                </div>

                                <div className="col-md-3" >
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="zone" name="zone" placeholder="Zone" value={zone} onChange={(rep) => { setZone(rep.target.value) }} />
                                        <label for='nom'>Zone</label>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ padding: '5px' }}>
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="commune" name="commune" placeholder="Commune" value={commune} onChange={(rep) => { setcommune(rep.target.value) }} />
                                        <label for='nom'>Commune</label>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ padding: '5px' }}>
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="fokontany" name="fokontany" placeholder="Fokontany" value={fokontany} onChange={(rep) => { setfokontany(rep.target.value) }} />
                                        <label for='nom'>Fokontany</label>
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ padding: '5px' }}>
                                    <div className='form-floating'>
                                        <input type="text" className="form-control" id="points" name="points" placeholder="Points" value={points} onChange={(rep) => { setpoints(rep.target.value) }} />
                                        <label for='nom'>Points</label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className='form-floating' style={{ padding: '5px' }}>
                                        <input type="text" className="form-control" id="code" name="code" placeholder="Code" value={code} onChange={(rep) => { setcode(rep.target.value) }} />
                                        <label for='nom'>Code</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div class="d-grid gap-2 mt-3">
                                        <Button variant="outline-success" onClick={() => fetch()}>Filtrer</Button>
                                    </div>
                                </div>
                            </Row>
                            <br /><br />
                            <Row>
                                {dataDate && dataDate.map((dt, index) => (
                                    <Col key={index} md={12}>
                                        <TableauBord date0={dt.date} heure0={dt.heure} etat={etat} autrefitre={dt.autrefitre} />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >



    )
}
