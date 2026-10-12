import React, { useEffect, useState } from 'react'
import './cardTask.css';
import { Button, Col, ProgressBar, Row } from 'react-bootstrap';

// animation
import { flipInX } from 'react-animations'
import Radium, { StyleRoot } from 'radium';

//modalupdate
import UpdateCard from './UpdateCard';
import SupprimerCard from './SupprimerCard';
import CommentCard from './CommentCard';
// import Signaler from './Signaler';
import Alarm from './Alarm';
import SousTache from './SousTache';
import TacheService from '../Service';
import Probleme from './Probleme';
var moment = require('moment');
const formatDate = "DD/MM/YYYY HH:mm";
moment().format();
const styles = {
    flipInX: {
        animation: 'x 1s',
        animationName: Radium.keyframes(flipInX, '')
    }
}
/////////////////////////////////////////////////////////color banier border 
const getColor = (id) => {
    if (id === 1) return '#d6d5d5';
    if (id === 2) return '#79bf3e';
    if (id === 3) return '#e79b63';
}

const setProgressColor = (values) => {
    if (values < 50) {
        return 'danger';
    }
    else return 'success';
}

{/* <ProgressBar now={(((new Date() - tache.debut) * 100) / (tache.fin - tache.debbut)) / 100} label={(((new Date() - tache.debut) * 100) / (tache.fin - tache.debbut)) / 100} variant='info' /> */ }
export default function CardTask({ tache, handleUpdate, handleDelete, retard }) { //ilay retard no migerer ny suppr sy ipdate
    console.log('hahahahahhaha', tache);
    const [terminer, setterminer] = useState(0);
    const [avancement, setavancement] = useState(0);
    const [total, settotal] = useState(0);
    //FUNCTION
    const dragStarted = (e, tache) => {
        // console.log('drag are started', tache);
        e.dataTransfer.setData("tache", JSON.stringify(tache));
    }

    let avancementFunction = () => {
        let TacheId = tache.id;
        TacheService.getAvancement(TacheId)
            .then(rep => {
                console.log('crad avacncemnt', rep.data);
                settotal(rep.data.total);
                setavancement(rep.data.avancement);
                setterminer(rep.data.terminer);
            })
            .catch(err => {
                console.log('ERRRR avancemnet erro', err);
            })
    }

    useEffect(() => {
        avancementFunction();
    }, [total, avancement]);


    return (
        <StyleRoot>
            <div draggable onDragStart={(e) => dragStarted(e, tache)} style={styles.flipInX}  >
                <div style={{ borderTop: `${getColor(tache.PrioriteId)} solid 8px` }} className='card'>
                    <Row >
                        <Col >
                            {tache.estAlerteur ? (<Alarm></Alarm>) : (<p></p>)}
                        </Col>
                        <Col >
                            <h5>{tache.titre}</h5>
                        </Col>
                        <Col sm={2} style={{ display: 'contents' }}>
                            <UpdateCard retard={retard} handleUpdate={handleUpdate} tache={tache} />
                            {retard ? (<p></p>) : (<SupprimerCard handleDelete={handleDelete} tache={tache} />)}
                            <CommentCard tache={tache} />
                            <Probleme tache={tache} />
                        </Col>
                    </Row>

                    <Row >
                        <Col>
                            <p>{moment(tache.debut).format(formatDate)}</p>
                        </Col>
                        <Col sm={4}>
                            <p>{moment(tache.fin).format(formatDate)}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label>Déscription</label>
                            <p>{tache.description}</p>
                            <label>Output</label>
                            <p>{tache.output}</p>
                        </Col>
                        <Col>

                            <Row>
                                <Col className='mb-2' sm={2}>
                                    <SousTache tache={tache} avancementFunction={avancementFunction} setProgressColor={setProgressColor} />
                                </Col>
                                <Col className='mt-1'>
                                    {terminer}/{total}
                                </Col>
                                <Col>
                                    {
                                        (moment().isAfter(moment(tache.fin).format(formatDate)) && tache.StatutId === 2) ?
                                            (
                                                <img style={{ width: "50px", height: "50px" }} src='../retard.gif' />
                                            ) : (
                                                <></>
                                            )
                                    }
                                </Col>
                            </Row>
                            <ProgressBar now={avancement} label={avancement + '%'} variant={setProgressColor(avancement)} />
                            <Row>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </StyleRoot >

    )
}
