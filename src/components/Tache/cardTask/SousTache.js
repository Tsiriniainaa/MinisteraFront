import moment from 'moment';
import React, { useEffect, useState } from 'react'

import { Modal, Row, Button, Form, OverlayTrigger, Tooltip, Col, ProgressBar } from 'react-bootstrap'
import TacheService from '../Service';
import './sousTache.css'

// animation\
import { fadeInUp } from 'react-animations'
import Radium, { StyleRoot } from 'radium';
import Swal from 'sweetalert2';
import useSound from 'use-sound';
import create from '../../sound/create.mp3';

const styles = {
    fadeInUp: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInUp, '')
    }
}

export default function SousTache({ tache, setProgressColor, avancementFunction }) {
    //sound
    const [play] = useSound(create);
    //modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //formulaire
    const [intitule, setIntitule] = useState('');
    const [SousTache, setSousTache] = useState([]);
    //avancemnet
    const [moyenne, setmoyenne] = useState(null);
    //calcul nombre terminer et non terminer 
    const [terminer, setterminer] = useState(0);

    // console.log('moyenne', moyenne);
    // function
    const calculAvancement = (rep) => {
        console.log('calcule avancement  kjguyg', rep);
        let checkNumber = 0;
        for (var total = 0; total < rep.length; total++)
            if (rep[total].isChecked) checkNumber++;
        setmoyenne((checkNumber * 100) / total);
        setterminer(checkNumber);
    }

    //////////////////////mila mi update ny state soustache ito manjary tsy miov a ilay avancemewnt 
    const handleSetCheck = (event, soustache) => {
        let isChecked = event.target.checked
        TacheService.setCheck({ isChecked, id: soustache.id })
            .then(rep => {
                // console.log('ovaina', soustache);
                const newState = SousTache.map(pop => {
                    if (pop.id === soustache.id) {
                        return { ...pop, isChecked };
                    }
                    return pop;
                })
                setSousTache(newState);
                calculAvancement(newState);  //////this is importatnt
                avancementFunction();
            })
            .catch(er => {
                console.log(er);
            })
    }


    const handleSave = () => {
        setIntitule('');
        TacheService.saveSousTache({ TacheId: tache.id, labele: intitule })
            .then(rep => {
                console.log('save', rep.data);
                // calculAvancement(SousTache);
                setSousTache([...SousTache, rep.data])
                setshowData([...showData, rep.data]);
                play();
                avancementFunction();
            })
            .catch(err => alert('somme error in server side'));
    }

    const handleDeleteL = (data) => {
        // console.log('HOFAFANA', test);
        Swal.fire({
            title: 'Confirm?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Supprimer!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Swal.fire(
                //     'Supprimer',
                //     'Sous Tache supprimer',
                //     'success'
                // ).then(() => {
                setSousTache(SousTache.filter(t => t.id !== data.id));
                setterminer(terminer - 1);
                // })
            }
        })
    }
    const [showData, setshowData] = useState([]);

    const getFiltre = event => {
        if (event.target.value.toLowerCase() === "") {
            setshowData(SousTache);
        }
        else {
            let rep = []
            setshowData(SousTache);
            SousTache.map(pop => {
                if ((pop.labele.toLowerCase().includes(event.target.value.toLowerCase()))) {
                    // setSousTache(pop);
                    rep.push(pop);
                }
            })
            setshowData(rep);
        }
    }

    useEffect(() => {
        if (show) {
            TacheService.getSousTacheByTache(tache.id)
                .then(rep => {
                    calculAvancement(rep.data);
                    setSousTache(rep.data);
                    setshowData(rep.data);
                })
                .catch(err => {
                    alert(err);
                })
        }

    }, [show]);

    return (
        <div>
            {/* <p>Ajouter</p> */}
            <OverlayTrigger
                key='top'
                placement='top'
                overlay={
                    <Tooltip id={`tooltip-top`}>
                        <strong>Checklist</strong>.
                    </Tooltip>
                }
            >
                <img onClick={handleShow} className='logos' src='../completed.jpg' />
            </OverlayTrigger>

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={handleClose}
                style={{ height: '100%' }}
            >
                <Modal.Header closeButton className='bg-info'>
                    <Modal.Title style={{ color: 'white' }}>Activités liés </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='p-3'>
                        {/*  */}
                        <Col>
                            <div className="m-2">
                                <img className='findLogo' src='../search.png' />
                                <input onChange={(e) => getFiltre(e)} placeholder='Filtre' className='findBarTask' style={{ backgroundColor: '#f1efef' }}></input>
                            </div>
                        </Col>


                    </Row>
                    <Row>
                        <Col sm={4} className="m-4">

                            <ProgressBar style={{ height: '20px' }} now={moyenne} label={Math.round(moyenne) + '%'} variant={setProgressColor(moyenne)} />

                        </Col>
                        <Col sm={3} className="m-4" style={terminer === SousTache.length ? { backgroundColor: '#198754', textAlign: 'center', height: '22px', width: '10%', borderRadius: '6px' } : { backgroundColor: 'rgb(13, 202, 240)', textAlign: 'center', height: '22px', width: '10%', borderRadius: '6px' }}>
                            <p style={{ color: 'white', fontWeight: '500' }}>{terminer}/{SousTache.length}</p>
                        </Col>
                    </Row>
                    <hr></hr>
                    <Form>
                        {/* //////////// liste des SousTaches*/}
                        <Row>
                            <Col className="boxSousTache">
                                <StyleRoot>
                                    {
                                        showData.length > 0 ?
                                            (
                                                showData.map(soustache => {
                                                    // console.log(coms);
                                                    return (
                                                        <div key={soustache.id + 'div'} className='soustache' style={styles.fadeInUp} >
                                                            <Row className='mt-2' key={soustache.id + 'r'}>
                                                                <Col sm={1} key={soustache.id + 'c2'}>
                                                                    <Form.Check
                                                                        key={soustache.id + 'chk'}
                                                                        type='checkbox'
                                                                        id={`default-checkbox`}
                                                                        defaultChecked={soustache.isChecked}
                                                                        // label={`terminer`}
                                                                        // onChange={(value, soustache) => console.log(value.target.checked, soustache)}
                                                                        onChange={(e) => handleSetCheck(e, soustache)}
                                                                    />
                                                                </Col>
                                                                <Col key={soustache.id + 'cs'}>
                                                                    <p className='pComs' key={soustache.id + 'ewr'} > {soustache.labele}</p>
                                                                </Col>
                                                                <Col sm={3} key={soustache.id + 'cas2'}>
                                                                    <p className='' key={soustache.createdAt} > {moment(soustache.createdAt).format('DD-MM-YY HH:MM')}</p>
                                                                </Col>
                                                                <Col sm={1} key={soustache.id + 'cdvf2'}>
                                                                    <img key={soustache.id + 'cvf2'} onClick={() => handleDeleteL(soustache)} className='logos' src='../delete.png' />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <center>
                                                    <img className='mt-5' src='../noData.png'></img>
                                                    <h5>No Data...</h5>
                                                </center>
                                            )

                                    }
                                </StyleRoot>
                            </Col>
                        </Row>
                        {/* ////////////////// */}
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Nouveaux</Form.Label>
                            <Form.Control onChange={(rep) => { setIntitule(rep.target.value) }} value={intitule} as="textarea" rows={3} />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Ajouter
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >

    )
}
