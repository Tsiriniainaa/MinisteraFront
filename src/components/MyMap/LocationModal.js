import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";



export default function LocationModal({ getLocalisation }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [initialPosition, setInitialPosition] = useState([-18.9283173, 47.5471958]);
    const [selectedPosition, setSelectedPosition] = useState([-18.9283173, 47.5471958]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
            console.log(initialPosition);
        });
    }, []);


    const Markers = () => {

        const map = useMapEvents({
            click(e) {
                setSelectedPosition([
                    e.latlng.lat,
                    e.latlng.lng
                ]);

                getLocalisation([e.latlng.lat, e.latlng.lng]);
            },
        })

        return (
            selectedPosition ?
                <Marker
                    key={selectedPosition[0]}
                    position={selectedPosition}
                    interactive={false}
                    icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
                />
                : null
        )

    }

    return (
        <>

            <Button variant="primary" onClick={handleShow}>
                Position
            </Button>

            <Modal
                size="lg"
                fullscreen={true}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show} onHide={handleClose}>
                <Modal.Header closeButton >
                    <Modal.Title>Ajouter votre Projet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer
                        center={selectedPosition || initialPosition}
                        zoom={12}
                    >
                        <Markers />
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" >
                        Valider
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}