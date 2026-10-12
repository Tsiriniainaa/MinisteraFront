import React, { useState } from 'react'
import { Col, Modal, Row, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
// import { Button } from 'react-bootstrap/lib/inputgroup'
// import { Form } from 'react-bootstrap/lib/navbar'
import DatePicker from 'react-date-picker'


export default function Alarm() {
    //modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //formulaire
    const [priority, setpriority] = useState("Bas");
    const [description, setdescription] = useState("");
    const [output, setoutput] = useState("");
    const [debut, setDebut] = useState(new Date());
    const [fin, setFin] = useState(new Date());
    return (
        <div>
            <OverlayTrigger
                key='top'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top`}>
                        <strong>Alarm</strong>.
                    </Tooltip>
                }
            >
                {/* <Button variant="secondary">Tooltip on {placement}</Button> */}
                <img onClick={handleShow} className='logos' src='../alarm2.png' />
            </OverlayTrigger>




            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier cette Tache</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
