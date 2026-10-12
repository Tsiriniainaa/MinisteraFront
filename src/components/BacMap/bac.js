import { React, useEffect,  useState } from 'react';
import { Radio } from 'antd';
import { useMap, MapContainer, Marker, Popup, TileLayer, LayersControl   } from 'react-leaflet'
import './styles.css';
import 'leaflet/dist/leaflet.css';
import { Control, Icon ,Layer} from 'leaflet';

import ServiceBac from './service';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav'
import Legende from './Legende';
import DateTimePicker from 'react-datetime-picker';
import DatePicker from 'react-datepicker';
import Swal from 'sweetalert2';

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
    { labele: 'tout', id: 0 },
    { labele: 'Vide', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'Plein', id: 3 },
    { labele: 'ND', id: 4 },
    { labele: 'TOTAL', id: 5 },
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

export default function Bac() {
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
console.log('huhuhuhu',mapType);
    useEffect(() => {
        fetch()
    }, [])

    function fetch() {
        let requestFiltre = { etatBac: valuelabelEtatBac, etatDebordement: valuelabelEtatDebordement, date: debut ,heure: 2}
        ServiceBac.getAllBac(requestFiltre)
            .then(rep => {
                
                setDebutR(requestFiltre.date);
                // console.log('===/',rep.data);
                if (rep.data.data.length === 0) {
                    Swal.fire({
                        toast: false,
                        title: "Pas d'information pour cette date",
                        timer: 3000,
                        icon: 'info',
                    })
                }
                setbac(rep.data.data);
                seteffectif(rep.data.effectif);
                //  console.log('===/',rep.data.data);
                
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
                                   Carte de remplissage de l'etat des bonbonnes à Antananarivo et ses périphériques
                                   <br/> en date du {debutR.toLocaleDateString()}
                                </div>
                            <Row className='p-3' style={{backgroundColor:'white'}}>
                                <Col  md={2}>
                                    <Radio.Group onChange={onMapTypeChange} value={mapType}>
                                            <Radio value="satellite">Satellite</Radio>
                                            <Radio value="streets">Streets</Radio>
                                    </Radio.Group>      
                                </Col>
                                <Col md={10} className="d-flex justify-content-around">
                                  
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
                                    </Form.Select>
                                    {/* <Form.Select
                                        values={{ valuelabelEtatDebordement }} onChange={async (rep) => { await setvaluelabelEtatDebordement(rep.target.value); }}
                                        style={{ width: "145px", padding: "10px" }}>
                                        <option value={0}>Débord</option>
                                        {labelEtatDebordement && labelEtatDebordement.map(option => {
                                            return (
                                                <option style={{ color: option.color }} key={option.id} value={option.id}>
                                                    {option.labele}
                                                </option>
                                            )
                                        })}
                                    </Form.Select> */}
                                    
                                    <DateTimePicker className="dateCss" onChange={setDebut} value={debut} format="y-MM-dd" />
                                    {/* <Form.Select
                                        values={{ valuelabelHeure }} onChange={async (rep) => { await setvaluelabelHeure(rep.target.value); }}
                                        style={{ width: "145px", padding: "10px" }}>
                                        <option value={0}>Matin</option>
                                        <option value={1}>Après midi</option>
                                        <option value={2}>Toute la journée</option>
                                    </Form.Select> */}
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
                                                            return (
                                                                <>
                                                                    <Marker position={[dt.longitude, dt.latitude]} icon={new Icon({ iconUrl: require(`./img/${dt.etat_in_bac.toString()}.png`), iconSize: [50, 50] })}>
                                                                        <Popup key={dt.localisation + 'dq'} minWidth={100}>
                                                                            <p key={dt.localisation + 'qi'}>Nom Pc:{dt.nom_pc}</p>
                                                                            <p key={dt.localisation + 'q'}>Localisation:{dt.localisation}</p>
                                                                            <p key={dt.localisation + 'qw'}>Date Signalement:{dt.date_signalement}</p>
                                                                            <p key={dt.localisation + 'qe'}>Heure Signalement:{dt.heure_signalement}</p>
                                                                            <p key={dt.localisation + 'qt'}>Etat Bac:{labelEtatBac[dt.etat_in_bac]['labele']}</p>
                                                                            <p key={dt.localisation + 'qr'}>Estimation Débordement:{labelEtatDebordement[dt.etat_debordement]['labele']}</p>
                                                                        </Popup>
                                                                    </Marker>
                                                                </>
                                                            )
                                                        })
                                                    )
                                                }
                                                {/*3) ////////////////////////controleur */}
                                            
                                                <Legende effectif={effectif} labelEtatBac={labelEtatBacs} />
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
                                                        return (
                                                            <>
                                                                <Marker position={[dt.longitude, dt.latitude]} icon={new Icon({ iconUrl: require(`./img/${dt.etat_in_bac.toString()}.png`), iconSize: [50, 50] })}>
                                                                    <Popup key={dt.localisation + 'dq'} minWidth={100}>
                                                                        <p key={dt.localisation + 'qi'}>Localisation:{dt.nom_pc}</p>
                                                                        <p key={dt.localisation + 'q'}>Point:{dt.localisation}</p>
                                                                        <p key={dt.localisation + 'qw'}>Date Signalement:{dt.date_signalement}</p>
                                                                        <p key={dt.localisation + 'qe'}>Heure Signalement:{dt.heure_signalement}</p>
                                                                        <p key={dt.localisation + 'qt'}>Etat Bonbonne:{labelEtatBac[dt.etat_in_bac]['labele']}</p>
                                                                        <p key={dt.localisation + 'qr'}>Fournisseur:{dt.fournisseur}</p>
                                                                    </Popup>
                                                                </Marker>
                                                            </>
                                                        )
                                                    })
                                                // )
                                            }
                                            {/*3) ////////////////////////controleur */}
                                            <Legende effectif={effectif} labelEtatBac={labelEtatBacs} />
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
