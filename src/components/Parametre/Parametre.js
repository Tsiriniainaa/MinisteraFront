import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import Header from '../header/Header';
import Nav from '../Nav/Nav';
import './parametre.css'
import ServiceForAll from '../ServiceForAll';
import ParametreService from './Service';



const action = ['Tout access', 'Supprimer', 'Modifier', 'Attribuer', 'Ajouter'];


const Parametre = () => {
    const [role, setrole] = useState([]);

    const [bas, setbas] = useState(0);
    const [moyen, setmoyen] = useState(0);
    const [haut, sethaut] = useState(0);

    useEffect(() => {
        ServiceForAll.getRole()
            .then(rep => {
                setrole(rep.data);
            })
    }, [])



    const handleAlerteur = () => {
        ParametreService.setConfigPriority(bas, moyen, haut)
            .then(rep => {
                console.log('success', rep);
            })
            .catch(err => {
                console.log('error', err);
            })
    }


    return (
        <div>
            <Row className='container-fluid'>
                <Col md={2}>
                    <Nav></Nav>
                </Col>
                <Col md={10} className={'container'}>
                    <Row>
                        <Header></Header>
                    </Row>

                    <Row>
                        <div className='boxParametre p-5'>
                            <Row>
                                <Col>
                                    <h5 style={{ color: 'grey' }}>Gestion des alerteurs</h5>
                                </Col>
                                <Col className='ml-2' md={2}>
                                    <Button class="btn btn-success mb-2 w-100">Enregistrer</Button>
                                </Col>

                                <hr></hr>
                                <Col className='mt-4 m-auto boxPrio p-auto' style={{ borderLeft: ' #5050f4 5px solid' }} md={4}>
                                    <h6 style={{ color: 'gray' }}>Bas</h6>
                                    <label> Jours :</label><input value={bas} type='number' className='inpuT' onChange={(rep) => setbas(rep.target.value)} />
                                    <br></br>
                                    <p style={{ color: 'gray' }}>Actuelement : 5h avant </p>
                                </Col>
                                <Col className='mt-4 m-auto boxPrio p-auto' style={{ borderLeft: ' #22ee05 5px solid' }} md={4}>
                                    <h6 style={{ color: 'gray' }}>Moyen</h6>
                                    <label> Jours :</label><input value={moyen} type='number' className='inpuT' onChange={(rep) => setmoyen(rep.target.value)} />
                                    <br></br>
                                    <p style={{ color: 'gray' }}>Actuelement : 5h avant </p>
                                </Col>
                                <Col className='mt-4 m-auto boxPrio p-auto' style={{ borderLeft: ' #ee0505  5px solid' }} md={4}>
                                    <h6 style={{ color: 'gray' }}>Urgent</h6>
                                    <label> Jours :</label><input value={haut} type='number' className='inpuT' onChange={(rep) => sethaut(rep.target.value)} />
                                    <br></br>
                                    <p style={{ color: 'gray' }}>Actuelement : 5h avant </p>
                                </Col>
                            </Row>
                            <Row className='mt-5'>
                                <Row>
                                    <Col>
                                        <h5 style={{ color: 'grey' }}>Gestion des actions</h5>
                                    </Col>
                                </Row>
                                <hr></hr>
                                <Row className='ml-2'>
                                    {/* <Col className='bg-info' md={2}>
                                        {role.map(rol => {
                                            return <p key={role.name}> {rol.name}</p>
                                        })}
                                    </Col>
                                    <Col className='bg-info' md={2}>
                                        {action.map(action => {
                                            return <p key={action}> {action}</p>
                                        })}
                                    </Col> */}

                                    <Table striped hover responsive >
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }}>Utilisateur</th>
                                                <th style={{ textAlign: 'center' }} colspan={action.length} >Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {role.map(rol => {
                                                return (
                                                    <tr>
                                                        <td>{rol.name}</td>
                                                        {
                                                            action.map(act => {
                                                                return <td><input type="checkbox" className="form-check-input" />{" "}{' ', act}</td>
                                                            })
                                                        }
                                                        {/* <td><input type="checkbox" className="form-check-input" /> Modifier</td>
                                                    <td><input type="checkbox" className="form-check-input" /> Ajouter</td>
                                                    <td><input type="checkbox" className="form-check-input" /> Access Complet</td> */}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>


                                </Row>

                            </Row>
                        </div>
                    </Row>
                </Col>
            </Row >
        </div >
    );
}

export default Parametre;
