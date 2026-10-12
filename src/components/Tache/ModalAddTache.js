import React, { useState } from 'react';
import { Button, Col, Modal, Row, Form, FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
//date
import DatePicker from 'react-date-picker'
import Swal from 'sweetalert2';
import useSound from 'use-sound';
import create from '../sound/create.mp3';
const options = [
  { id: 1, name: "Bas" },
  { id: 2, name: "Moyen" },
  { id: 3, name: "Urgent" },
];


export default function ModalAddTache({ handleSave }) {
  //sound
  const [play] = useSound(create, { volume: 1 });
  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //formulaire
  const [titre, settitre] = useState(null);
  const [PrioriteId, setpriority] = useState(1);
  const [showDateAlerter, setshowDateAlerter] = useState(false);
  const [description, setdescription] = useState(null);
  const [output, setoutput] = useState(null);
  const [debut, setDebut] = useState(new Date());
  const [fin, setFin] = useState(new Date());
  const [estAlerteur, setalerteur] = useState(false);
  //data generer
  //function
  const handleSaveLocal = () => {
    const modelTask = {
      titre,
      debut,
      fin,
      PrioriteId,
      description,
      output,
      estAlerteur,
    }
    if (titre === null || description === null || output === null) {
      Swal.fire({
        toast: true,
        title: 'Veuiller remplir tout les champs!',
        timer: 1000,
        icon: 'warning',
      })
    }
    else {
      handleSave(modelTask);
      settitre(null); setoutput(null); setdescription(null);
      play();
      setShow(false);
    }

  }


  return (
    <>

      <OverlayTrigger
        key='top'
        placement='top'
        overlay={
          <Tooltip id={`tooltip-end`}>
            <strong>Ajout Tache</strong>.
          </Tooltip>
        }
      >
        <img onClick={handleShow} className='logoAdd' src='../ajoutTask.jpg' />
      </OverlayTrigger>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='bg-success' closeButton>
          <Modal.Title style={{ color: 'white' }}>Ajouter nouvelle Tache</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Row>
                <Col className='m-2'>
                  <p>Debut</p>
                  <DatePicker onChange={setDebut} value={debut} />
                </Col>
                <Col className='m-auto'>
                  <p>Fin</p>
                  <DatePicker onChange={setFin} value={fin} />
                </Col>
              </Row>
              <br></br>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Titre *</Form.Label>
                <Form.Control onChange={(rep) => { settitre(rep.target.value) }} rows={3} />
              </Form.Group>
              <Row>
                {/* <Form.Label>Priorité</Form.Label> */}
                <Col>

                  <Form.Select values={{ options }} onChange={(rep) => { setpriority(rep.target.value); }} style={{ padding: "10px" }}>
                    <option>Priorité</option>
                    {options.map(option => {
                      return (
                        <option style={{ color: option.color }} key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      )
                    })}
                  </Form.Select>

                </Col>
              </Row>

              <Row>
                {/* <br></br> */}
                <Col className="mt-3">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Activer alerteur"
                    onChange={(e) => setalerteur(e.target.checked)}
                  />
                </Col>
              </Row>
            </Form.Group>

            <FloatingLabel controlId="floatingTextarea2" label="Déscription*">
              <Form.Control onChange={(rep) => { setdescription(rep.target.value) }} as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }} />
            </FloatingLabel>
            <br></br>
            <FloatingLabel controlId="floatingTextarea2" label="Output*">
              <Form.Control onChange={(rep) => { setoutput(rep.target.value) }} as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }} />
            </FloatingLabel>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          <Button variant="success" onClick={handleSaveLocal}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}
