import React, { useEffect, useState } from 'react';
// import { BsPlusCircle } from "react-icons/bs";
import { Button, Col, Modal, Row, Form, OverlayTrigger, Tooltip, FloatingLabel } from 'react-bootstrap';
//date
import DatePicker from 'react-date-picker'
//reducer
// import { addTache } from './TacheSlice';
// import { useSelector, useDispatch } from 'react-redux';
// import moment from 'moment';

const options = [
  {
    id: 1,
    name: "Bas",
    // color: "blue"
  },
  {
    id: 2,
    name: "Moyen",
    // color: "#0ff10f"
  },
  {
    id: 3,
    name: "Urgent",
    // color: "red"
  },
];


export default function UpdateCard({ handleUpdate, tache, retard }) {
  // console.log('RRRRRRRRRRRr', retard);
  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //formulaire
  const [PrioriteId, setpriority] = useState(tache.PrioriteId);
  // const [showDateAlerter, setshowDateAlerter] = useState(false);
  const [description, setdescription] = useState(tache.description);
  const [output, setoutput] = useState(tache.output);
  const [debut, setDebut] = useState(new Date(tache.debut));
  const [fin, setFin] = useState(new Date(tache.fin));
  const [estAlerteur, setalerteur] = useState(tache.estAlerteur);

  //data generer
  //function
  // console.log('begin', tache)
  const handleUpdateLocal = () => {
    const modelTask = {
      id: tache.id,
      debut,
      fin,
      PrioriteId,
      description,
      output,
      estAlerteur,
      StatutId: tache.StatutId
    }
    // console.log('cgcgcg', modelTask);
    handleUpdate(modelTask);
    setShow(false);
  }

  return (
    <>
      <OverlayTrigger
        key='top'
        placement='top'
        overlay={
          <Tooltip id={`tooltip-top`}>
            <strong>Modifier</strong>.
          </Tooltip>
        }
      >
        {/* <Button variant="secondary">Tooltip on {placement}</Button> */}
        <img onClick={handleShow} className='logos' src='../edit.png' />
      </OverlayTrigger>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className='bg-warning'>
          <Modal.Title>Modification</Modal.Title>
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
              <Row>
                <Form.Label>Priorité</Form.Label>
                <Col>
                  <Form.Select values={{ options }} defaultValue={PrioriteId} onChange={(rep) => { setpriority(rep.target.value); }} style={{ padding: "10px" }}>
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
                    checked={estAlerteur}
                    onChange={(e) => setalerteur(e.target.checked)}
                  />
                </Col>
              </Row>
            </Form.Group>

            <FloatingLabel controlId="floatingTextarea2" label="Déscription">
              <Form.Control onChange={(rep) => { setdescription(rep.target.value) }} as="textarea" defaultValue={description} style={{ height: '100px' }} />
            </FloatingLabel>
            <br></br>
            <FloatingLabel controlId="floatingTextarea2" label="Output">
              <Form.Control onChange={(rep) => { setoutput(rep.target.value) }} as="textarea" defaultValue={output} style={{ height: '100px' }} />
            </FloatingLabel>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateLocal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}
