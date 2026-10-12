
import React, { useEffect, useState } from 'react'

import { Modal, Button, } from 'react-bootstrap'
// import TacheService from '../Service';
// import './commentaire.css'

// animation
import { fadeInDown } from 'react-animations'
import Radium, { StyleRoot } from 'radium';
import CardTask from './cardTask/CardTask';
import Swal from 'sweetalert2';
import useSound from 'use-sound';
import event from '../sound/event.mp3'
import TacheService from './Service';
const styles = {
    fadeInDown: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInDown, '')
    }
}

export default function ModalTacheEnRetard({ retard, handleActiver }) {
    //sound
    const [play] = useSound(event);
    //modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    //state retard
    const [tacheRetard, settacheRetard] = useState([]);
    //FUNCRION
    // const handleDeleteL = (tacheRetard) => {

    // }
    const handleActiverLocal = () => { ///update massive 
        Swal.fire({
            title: 'Les previsions seront ajuster ajourdhui!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Activer'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Activation',
                    'Tache mis en cours',
                    'success'
                ).then(() => {
                    TacheService.updateRetard({ tacheRetard })
                        .then(rep => {
                            handleActiver(tacheRetard);
                            setShow(false);
                            setTimeout(() => {
                                window.location.reload();
                            }, 400);
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
            }
        })
    }


    useEffect(() => {
        if (retard.length > 0) {
            settacheRetard(retard);
            setTimeout(() => {
                setShow(true);
            }, 500);
        }
    }, [retard])

    return (
        <div>
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                // centered
                show={show}
                onHide={handleClose}>
                <Modal.Header className='bg-danger' closeButton>
                    <Modal.Title style={{ color: 'white' }}>({tacheRetard.length}) taches en retard selon leur previsions</Modal.Title>
                </Modal.Header>
                <Modal.Body >   
                    <StyleRoot style={{ overflow: 'auto', height: '600px' }}>
                        {
                            tacheRetard.map(tacheR => {
                                return (
                                    <CardTask key={tacheR.id} retard={{ retard: true }} tache={tacheR} />
                                )
                            })

                        }
                    </StyleRoot>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Ignorer
                    </Button>
                    <Button variant="primary" onClick={handleActiverLocal}>
                        Activer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >

    )
}
