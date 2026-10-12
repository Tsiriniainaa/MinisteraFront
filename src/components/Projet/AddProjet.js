import React, { useState } from 'react';

// import { BsPlusCircle } from "react-icons/bs";

import { Button, Col, Modal, Row, Form } from 'react-bootstrap';

//date
import DatePicker from 'react-date-picker'
import LocationModal from '../MyMap/LocationModal';
//colorpickup
import { CirclePicker } from 'react-color';
import Swal from 'sweetalert2';


export default function AddProject({ handleSave, user }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //formulaire
  const [titre, settitre] = useState(null);
  const [debut, setDebut] = useState(new Date());
  const [fin, setFin] = useState(new Date());
  const [latitude, setlatitude] = useState();
  const [longitude, setlongitude] = useState();
  //colorProject
  const [color, setcolor] = useState('#9999');  ///ne gere pas la couleur

  ////////FONCTION/////////////////
  function handleChangeComplete(color) {
    setcolor(color);
    // console.log('COLOCOl', color);
  }
  function getLocalisation(array) {
    // alert('test')
    console.log('location', array);
    setlatitude(array[0]);
    setlongitude(array[1]);
  }
  const handleSaveLocal = () => {
    const modelProjet = {
      DepartementId: user.DepartementId,
      debut,
      description:'description',
      fin,
      titre,
      latitude,
      longitude,
      color: color.hex
    }
    console.log('model Projet', modelProjet);
    if (titre === null || latitude === null || longitude === null) {
      Swal.fire({
        toast: true,
        title: 'Veuiller remplir tout les champs!',
        timer: 1000,
        icon: 'warning',
      })
    }
    else {

      handleSave(modelProjet)
      // .then(rep => {
      //clear formulaire and hide modal
      settitre(null); setlatitude(null); setlongitude(null);
      setShow(false);

    }
  }

  /////////// /////VIEW /////////  
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {/* <img className='logoAdd' src='../ajoutTask.jpg' /> */}
        Nouveaux
      </Button>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ backgroundColor: color.hex }}>
          <Modal.Title>Ajouter votre Projet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col>
                  <Form.Label>Debut</Form.Label>
                  <DatePicker onChange={setDebut} value={debut} />
                </Col>
                <Col>
                  <Form.Label>Fin</Form.Label>
                  <DatePicker onChange={setFin} value={fin} />
                </Col>
              </Row>
              <br></br>
            </Form.Group>
            <Row>
              <Col md={7}>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Titre de votre projet *</Form.Label>
                  <Form.Control onChange={(rep) => { settitre(rep.target.value) }} rows={3} />
                </Form.Group>
              </Col>
              <Col>
                <CirclePicker
                  color={color}
                  onChangeComplete={handleChangeComplete}
                />
              </Col>
            </Row>
            <Row>

              <Col md={4}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Latitude *</Form.Label>
                  <Form.Control value={latitude} onChange={(rep) => { setlatitude(rep.target.value) }} rows={3} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Longitude *</Form.Label>
                  <Form.Control value={longitude} onChange={(rep) => { setlongitude(rep.target.value) }} rows={3} />
                </Form.Group>
              </Col>

              <Col md={4} className='mt-4'>
                <div>
                  <LocationModal getLocalisation={getLocalisation} />

                </div>
              </Col>
            </Row>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveLocal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
