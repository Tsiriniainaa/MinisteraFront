import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Service from '../Service';
import CardTask from '../../Tache/cardTask/CardTask';

export default function Retard({ statut }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [dataShowing, setdataShowing] = useState([]);

    useEffect(() => {
        if (show) { ////this is important
            if (statut === 'avance') {
                console.log('tttttttttttttttttttt');
                Service.tracageAvance()
                    .then(rep => {
                        setdataShowing(rep.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
            else {
                Service.tracageRetard()
                    .then(rep => {
                        setdataShowing(rep.data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }, [show]);
    ///////////get avancement
    return (
        <>
            <p variant="primary" onClick={handleShow} className="me-2">
                Afficher
            </p>

            <Offcanvas show={show} placement="end" onHide={handleClose}>
                <Offcanvas.Header style={{ backgroundColor: '#35538b' }} closeButton>
                    <Offcanvas.Title style={{ color: 'white' }}>Liste des taches en {statut}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {
                        dataShowing.map(tache => {
                            return <CardTask key={tache.id} tache={tache} />
                        })
                    }

                </Offcanvas.Body>
            </Offcanvas>

        </>
    );
}