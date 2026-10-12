import moment from 'moment';
import React, { useEffect, useState } from 'react'

import { Modal, Row, Button, Form, OverlayTrigger, Tooltip, Col } from 'react-bootstrap'
import TacheService from '../Service';
import './commentaire.css'
//sound
import useSound from 'use-sound';
import commentSound from '../../sound/pop.mp3';

// animation
import { fadeInUp } from 'react-animations'
import Radium, { StyleRoot } from 'radium';
const styles = {
  fadeInUp: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeInUp, '')
  }
}

export default function CommentCard({ tache }) {
  //sound
  const [play] = useSound(commentSound);
  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //formulaire
  const [intitule, setIntitule] = useState('');
  const [commentaire, setcommentaire] = useState([]);
  // function
  const handleSave = () => {
    play();
    setIntitule('');
    TacheService.saveCommentaire({ intitule, TacheId: tache.id })
      .then(rep => {
        console.log('save', rep.data);
        setcommentaire([...commentaire, rep.data]);
      })
      .catch(err => {
        console.log(err);
      })
  }

  useEffect(() => {
    console.log('ilay nalaina', tache.id)
    if (show) { /////important mncontrole an le izy tsy haka ny commentaire rehetra
      TacheService.getCommentaireBytache(tache.id)
        .then(rep => {
          // alert('nak');
          console.log(rep.data);
          setcommentaire(rep.data);
        })
        .catch(err => {
          alert('somme error in server side');
        })
    }

  }, [show]);

  return (
    <div>
      <OverlayTrigger
        key='top'
        placement='top'
        overlay={
          <Tooltip id={`tooltip-top`}>
            <strong>Commenter</strong>.
          </Tooltip>
        }
      >
        <img onClick={handleShow} className='logos' src='../comment.png' />
      </OverlayTrigger>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Commentaire lié a cette tache</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* //////////// liste des commentaires*/}
            <Row>
              <Col className="boxCommentaire">
                <StyleRoot>
                  {
                    commentaire.length > 0 ? (
                      commentaire.map(coms => {
                        // console.log(coms);
                        return (
                          <div className='commentaire' style={styles.fadeInUp} >
                            <Row key={coms.id + 'r'}>
                              <Col key={coms.id + 'c'}>
                                <div className="boxProfil">

                                  <img className="imgProfil" src='../dsi.png'></img>

                                </div>
                                <p className='p-4 pComs' key={coms.id} > {coms.intitule}</p>
                              </Col>
                              <Col sm={4} key={coms.id + 'c2'}>
                                <p className='p-4 pComs' key={coms.createdAt} > {moment(coms.createdAt).format('DD-MM-YY HH:MM')}</p>
                              </Col>
                            </Row>
                            {/* <hr></hr> */}
                          </div>
                        )
                      })
                    ) : (<center>
                      <img className='mt-5' src='../noComment.png'></img>
                      {/* <h5>No Data...</h5> */}
                    </center>)
                  }
                </StyleRoot>
              </Col>
            </Row>
            {/* ////////////////// */}
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Ecrire un commentaire</Form.Label>
              <Form.Control onChange={(rep) => { setIntitule(rep.target.value) }} value={intitule} as="textarea" rows={3} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            commenter
          </Button>
        </Modal.Footer>
      </Modal>
    </div >

  )
}
