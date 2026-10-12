import { React, useEffect, useState } from 'react';
import { Radio } from 'antd';
import { useMap, MapContainer, Marker, Popup, TileLayer, LayersControl } from 'react-leaflet'
import './styles.css';
import 'leaflet/dist/leaflet.css';
import { Control, Icon, Layer } from 'leaflet';

import ServiceBac from './service';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav'
import Legende from './Legende';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';
import LegendeP from './LegendeP';
import Input from 'antd/es/input/Input';

const center = [-18.865447, 47.519533]

let labelEtatBac = [
    { labele: 'tout', id: 0 },
    { labele: 'Vide', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'Plein', id: 3 },
    { labele: 'ND', id: 4 },
    // { labele: 'Trop Plein', id: 5 },
    // { labele: 'Débordement', id: 6 }
];

let labelEtatBacs = [
    { labele: '1fois / jour', id: 0 },
    { labele: '2fois / jour', id: 1 },
    { labele: '1fois / 2jours', id: 2 }
    // { labele: 'Trop Plein', id: 5 },
    // { labele: 'Débordement', id: 6 }
];

let labelEtatDebordement = [
    { labele: 'tout', id: 0 },
    { labele: 'Quart', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'trois quart', id: 3 },
    { labele: 'Plein', id: 4 },
    { labele: 'Trop Plein', id: 5 },
    { labele: 'Débordement', id: 6 }
];

export default function CarteSituation() {
    const [valuelabelEtatBac, setvaluelabelEtatBac] = useState(0);
    const [valuelabelEtatDebordement, setvaluelabelEtatDebordement] = useState(0);
    const [valuelabelHeure, setvaluelabelHeure] = useState(0);
    //state
    const [bacs, setbac] = useState([]);
    const [debut, setDebut] = useState(new Date());
    const [effectif, seteffectif] = useState([]);
    const [debutR, setDebutR] = useState(new Date());
    let df = JSON.parse(localStorage.getItem('mapView'));
    const [mapType, setMapType] = useState(df);
    const [zone, setZone] = useState("")
    const [commune, setcommune] = useState("")
    const [fokontany, setfokontany] = useState("")
    const [date, setDate] = useState(new Date)

    // console.log(df,'kjhgkjhg');

    // if(mapType){
    // } 

    const onMapTypeChange = (e) => {
        setMapType(e.target.value);
        localStorage.setItem('mapView', JSON.stringify(e.target.value));
        // setMapType(df)
        window.location.reload();

        // setMapType()
    };
    //console.log('huhuhuhu', mapType);
    useEffect(() => {
        fetch()
    }, [])

    function filtre(set){
        set()
        fetch()
    }

    function fetch() {
        let requestFiltre = {zone:zone,commune:commune,fokontany:fokontany}
        ServiceBac.getAllDonneeCartographique(requestFiltre)
            .then(rep => {
                console.log(rep.data.data)
                if (rep.data.data.length === 0) {
                    Swal.fire({
                        toast: false,
                        title: "Pas d'information pour cette date",
                        timer: 3000,
                        icon: 'info',
                    })
                }
                setbac(rep.data.data);
                console.log(bacs)
                seteffectif(rep.data.effectif);
            })
            .catch(err => {
                console.log('error', err);
            })
    }

    //view  
    return (
        <div>
            <Row className='container-fluid'>
                <Col md={2}>
                    <Nav></Nav>
                </Col>
                <Col md={10} className={'container'}>
                    <Row>
                        <Col md={12} className="bg-white filtre">
                            {/* filtre */}
                            <div className='title_style'>
                                Localisation des bonbonnes à Antananarivo et ses périphériques
                            </div>
                            <Row className='p-3' style={{ backgroundColor: 'white' }}>
                                <Col md={2}>
                                    <Radio.Group onChange={onMapTypeChange} value={mapType}>
                                        <Radio value="satellite">Satellite</Radio>
                                        <Radio value="streets">Streets</Radio>
                                    </Radio.Group>
                                </Col>
                                <Col md={10} className="d-flex justify-content-around">
                                    <div className="col-md-2">
                                        <div className='form-floating'>
                                            <input type="text" className="form-control" id="zone" name="zone" placeholder="Zone" value={zone} onChange={(rep) => { filtre(()=>{setZone(rep.target.value)}); }} />
                                            <label for='nom'>Zone</label>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className='form-floating'>
                                            <input type="text" className="form-control" id="commune" name="commune" placeholder="Points" value={commune} onChange={(rep) => { filtre(()=>{setcommune(rep.target.value);}) }} />
                                            <label for='nom'>Points</label>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <div className='form-floating'>
                                            <input type="text" className="form-control" id="fokontany" name="fokontany" placeholder="fokontany" value={fokontany} onChange={(rep) => { filtre(()=>{setfokontany(rep.target.value)}); }} />
                                            <label for='nom'>Fokontany</label>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-2">
                                        <div className='form-floating'>
                                            <input type="date" className="form-control" id="date" name="date" placeholder="Date" value={date} onChange={(rep) => { filtre(()=>{setDate(rep.target.value)}); }} />
                                            <label for='nom'>Date</label>
                                        </div>
                                    </div> */}
                                    
                                    {/* 
                                    <Form.Select
                                        values={{ valuelabelEtatBac }} onChange={async (rep) => { await setvaluelabelEtatBac(rep.target.value); }}
                                        style={{ width: "145px", padding: "10px" }}>
                                        {labelEtatBacs && labelEtatBacs.map(option => {
                                            return (
                                                <option style={{ color: option.color }} key={option.id} value={option.id}>
                                                    {option.labele}
                                                </option>
                                            )
                                        })}
                                    </Form.Select> */}

                                    {/* <DateTimePicker className="dateCss" onChange={setDebut} value={debut} format="y-MM-dd" />*/}
                                    <Button variant="outline-success" onClick={fetch}>Filtrer</Button> 
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Row>
                                        {mapType === 'satellite' ?
                                            (
                                                <MapContainer center={center} zoom={13} scrollWheelZoom={true}>

                                                    <TileLayer
                                                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                                    />
                                                    {
                                                        // bacs !== [] &&
                                                        (
                                                            bacs.map(dt => {
                                                                { console.log(dt) }
                                                                return (
                                                                    <>
                                                                        <Marker position={[Number(dt.latitude), Number(dt.longitude)]} icon={new Icon({ iconUrl: require(`./img2/${dt.etat_actions.toString()}.png`), iconSize: [50, 50] })}>
                                                                            <Popup minWidth={100}>
                                                                                <p >Points:{dt.commune}</p>
                                                                                <p >Fokontany:{dt.fokontany}</p>
                                                                                <p >Actions:{dt.actions}</p>
                                                                                <p >Cap(m3)_BBN:{dt.cap}</p>
                                                                                <p >Staff Meah:{dt.staff_meah}</p>
                                                                            </Popup>
                                                                        </Marker>
                                                                    </>
                                                                )
                                                            })
                                                        )
                                                    }
                                                    {/*3) ////////////////////////controleur */}

                                                    <LegendeP effectif={effectif} labelEtatBac={labelEtatBacs} />
                                                </MapContainer>
                                            ) : (
                                                <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    {
                                                        // bacs !== [] &&
                                                        // (
                                                        bacs.map(dt => {
                                                            { console.log(dt) }

                                                            return (
                                                                <>
                                                                    <Marker position={[Number(dt.latitude), Number(dt.longitude)]} icon={new Icon({ iconUrl: require(`./img2/${dt.etat_actions.toString()}.png`), iconSize: [50, 50] })}>
                                                                        <Popup minWidth={100}>
                                                                            <p >Points:{dt.commune}</p>
                                                                            <p >Fokontany:{dt.fokontany}</p>
                                                                            <p >Actions:{dt.actions}</p>
                                                                            <p >Cap(m3)_BBN:{dt.cap}</p>
                                                                            <p >Staff Meah:{dt.staff_meah}</p>
                                                                        </Popup>
                                                                    </Marker>

                                                                </>
                                                            )
                                                        })
                                                        // )
                                                    }
                                                    {/*3) ////////////////////////controleur */}
                                                    <LegendeP effectif={effectif} labelEtatBac={labelEtatBacs} />
                                                </MapContainer>
                                            )}
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >



    )
}
