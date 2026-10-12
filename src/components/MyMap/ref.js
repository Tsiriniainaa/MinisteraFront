import React, { useEffect, useState } from 'react';
///leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './styles.css';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'


import { Col, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav';
import Header from '../header/Header';
import ProjetService from '../Projet/Projet.service';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';


const centers = { lat: -18.865447, lng: 47.519533 }


const MyMap = () => {
    const [position, setPosition] = useState(centers);
    const user = JSON.parse(localStorage.getItem('users'));
    const [projet, setprojet] = useState([]);
    const navigate = useNavigate();

    //function
    const getTache = (id) => {
        navigate(`/tachesById/${id}`);
    }


    useEffect(() => {

        ProjetService.getAllByDept(user.DepartementId)
            .then(rep => {
                console.log('getAllProject', rep);
                setprojet(rep.data);
            })
            .catch(err => {
                console.log('errrrr', err);
            })
    }, [])
    console.log('lplplplplplplplp', projet)

    return (
        <div style={{ overflow: 'hidden' }}>
            <Row className='container-fluid'>
                {/* ///////////////////////component include NAVIGATION */}
                <Col md={2}>
                    <Nav></Nav>
                </Col>
                {/* /////////////////CONTAINER */}
                <Col md={10} className={'container'}>
                    <Row>
                        <Header></Header>
                    </Row>





                    <Row>
                        <Col md={12} className="boxMain">
                            <MapContainer center={centers} zoom={13} scrollWheelZoom={true}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />


                                {
                                    projet.length > 0 && (
                                        projet.map(projet => {
                                            return (
                                                <Marker position={[projet.latitude, projet.longitude]} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                                                    <Popup minWidth={90}>
                                                        <h1>{projet.titre}</h1>
                                                        <p>Debut:{moment(projet.debut).format('dd/mm/yyyy')}</p>
                                                        <p>Fin:{moment(projet.fin).format('dd/mm/yyyy')}</p>
                                                        <p>Fin:{projet.avancement}</p>
                                                        <p onClick={() => getTache(projet.id)}> Voir les taches</p>
                                                    </Popup>
                                                </Marker>
                                            )
                                        })
                                    )
                                    // : (
                                    //     <div className='boxSpinner'>
                                    //         <center>
                                    //             <BeatLoader className='p-5' color="#36d7b7" />
                                    //         </center>
                                    //         <h3>veuillez patienter😃</h3>
                                    //     </div>
                                    // )
                                }


                            </MapContainer>
                        </Col>
                    </Row>

                </Col>

            </Row >
        </div >
    )
}

export default MyMap;
