import React from 'react';
import { Badge, Col, ProgressBar, Row } from 'react-bootstrap';
// animation
import { fadeIn } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
// import Taches from '../Tache/Taches';

const styles = {
    fadeIn: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeIn, 'fadeIn')
    }
}

// var moment = require('moment');
// const formatDate = "DD/MM/YYYY HH:mm";
export default function CardProjet({ projet }) {
    const navigate = useNavigate();

    //function
    const getTache = () => {
        // navigate(`/tachesById/${projet.id}`);
        navigate(`/tachesById`, { state: { projet } });
    }


    return (
        <StyleRoot>
            <div style={styles.fadeIn} className='projet' onClick={() => getTache()} >
                <div className='head' style={{ backgroundColor: projet.color }}>
                    <Row>
                        <center>
                            {/* //////gestion si pas de couleur */}
                            <h5 style={{ color: projet.color ? 'white' : 'black' }} > {projet.titre}</h5>
                        </center>
                    </Row>
                    <Row>
                        <Col>
                            <i style={{ color: 'white' }}> {moment(projet.debut).format('DD/MM/YYYY')}</i>
                        </Col>
                        <Col>
                            <i style={{ color: 'white' }}> {moment(projet.fin).format('DD/MM/YYYY')}</i>
                        </Col>
                    </Row>
                </div>
                <div className='bodyCard'>
                    <Row>
                        <Col>
                            <p>
                                <Badge bg="success">
                                    {
                                        projet.totalTache === projet.tacheTerminer && projet.totalTache !== 0 && projet.tacheTerminer !== 0 ?
                                            <i>terminer</i>
                                            : <i>en cours</i>
                                    }
                                </Badge>
                            </p>
                        </Col>
                        <Col md={6}>
                            <p className='mt-1'><ProgressBar style={{ height: '20px' }} now={projet.avancement} label={projet.avancement} /></p>
                        </Col>
                    </Row>
                    <p><strong>Region</strong>: Antananarivo</p>
                    <p><strong>Taches</strong>: {projet.totalTache}</p>
                    <p><strong>Terminer</strong>: {projet.tacheTerminer}</p>
                    {/* <p><strong>Commentaires</strong>:<span className="visually-hidden">unread messages</span><Badge bg="primary">9</Badge> nouveaux </p> */}

                    <span className="visually-hidden">unread messages</span>
                </div>
            </div>
        </StyleRoot >
    )
}
