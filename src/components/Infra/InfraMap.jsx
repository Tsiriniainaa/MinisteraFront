
import React, { useEffect, useState } from 'react';
///leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import './styles.css';
// import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'


import { Button, Col, Container, Form, Nav, Navbar, NavDropdown, ProgressBar, Row } from 'react-bootstrap';

import moment from 'moment';

import ServiceInfra from './service';




const InfraMap = () => {
    const centers = { lat: -18.865447, lng: 47.519533 }
    const [infra, setinfra] = useState([]);

    useEffect(() => {
            ServiceInfra.getAllInfra()
            .then(rep=>{
                console.log(rep.data);
                setinfra(rep.data)
            })
            .catch(err=>{
                console.log('some err in infra',err);
                alert(err.message);
            })
    }, []);


    return (
        <div>
            <Row>
                <Navbar bg="light" expand="lg">
                 <Container fluid>
                 
                    <Navbar.Brand href="#">  <img className="ministeraSary" src='../ministere.png'></img></Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="/infra">Tableau</Nav.Link>
                        <Nav.Link href="/carto_infra">Cartografier</Nav.Link>

                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    </Navbar.Collapse>
                 </Container>
                </Navbar>
            </Row>
            <Row className='container-fluid my-3'>
                <Col md={12}>
                    <Row>
                        <Col md={12}>
                            <MapContainer center={centers} zoom={7} scrollWheelZoom={true}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                {
                                    infra.length > 0 && (
                                        infra.map(inf => {
                                            return (
                                                <Marker position={[inf.latitude, inf.longitude]} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
                                                    <Popup minWidth={100}>
                                                        <h1>{inf.region}</h1>
                                                        <p>district:{inf.district}</p>
                                                        <p>communes:{inf.communes}</p>
                                                        <p>localite:{inf.localite}</p>
                                                        <p>milieu:{inf.milieu}</p>
                                                        <p>nombre Point d'eau:{inf.nb_point_eau}</p>
                                                        <p>Bénéficiaire:{inf.nb_benef}</p>
                                                        <p>Type inf:{inf.type_infra}</p>
                                                        <p>Type travaux:{inf.type_travaux}</p>
                                                        <p>Type gestion:{inf.type_gestion}</p>
                                                        <p>Montant:{inf.montant_reel}</p>
                                                        <p>financement:{inf.financement}</p>
                                                        <p>date_prevue:{inf.date_prevue}</p>
                                                    </Popup>
                                                </Marker>
                                            )
                                        })
                                    )
                                }
                            </MapContainer>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default InfraMap;
