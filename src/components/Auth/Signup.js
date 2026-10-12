import React, { useState } from 'react'
import { Row, Col, Button, Image, Alert, FloatingLabel, Form } from 'react-bootstrap';
import './Signin.css';
// import UserService from '../../service/UserService.js'
import { useNavigate } from 'react-router';

import { AuthService } from './Auth.service';
import { useEffect } from 'react';
import { ServiceForAll } from '../ServiceForAll';
const posteStat = [
    { id: 1, labele: 'Stagiaire' },
    { id: 2, labele: "Chef d'equipe" },
    { id: 3, labele: 'employer' },
    { id: 4, labele: 'Technicien' },
    { id: 5, labele: 'Autre' },

]

export default function Signup() {
    //state
    const [listeposte, setlisteposte] = useState(posteStat);

    //formulaire
    const [listedepartement, setlistedepartement] = useState('');
    const [departement, setdepartement] = useState('');
    const [poste, setposte] = useState('');
    const [contact, setcontact] = useState('');
    const [email, setmail] = useState('');
    const [username, setusername] = useState('');
    // const [password, setpassword] = useState('');
    // console.log(poste);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        ServiceForAll.getDept()
            .then(rep => {
                setlistedepartement(rep.data);
            })
            .catch(err => {
                console.log(err);
            });

    }, [])

    function submiSignup() {
        let data = { email, username, poste, contact, departement };
        // console.log(data);
        if (email == '' || username == '', poste == '' || contact == '' || departement == '') {
            setError('remplire tout les champs!')
        }
        else {
            console.log(data, 'data');

            AuthService.signup(data)
                .then(rep => {
                    alert("Vous allez etre activer par l'equipe DSI, veuillez patientez");
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);

                })
                .catch(err => {
                    //connnection reussie mais user non reconnue
                    if (err.response.data.message) {
                        setError(err.response.data.message);
                    }
                    // connection perdu
                    else {
                        console.log('XXXXXXXXXXXXXXXX', err);
                    }
                })
        }
    }

    return (
        <Row>
            <Col md={4}>
                <div className="formulaire-containerI">
                    <div className="logo">
                        <h1>Inscription </h1>
                        <p>sur notre plateforme</p>
                        <br></br>
                    </div>

                    {/* <div className='slogon'>
                        <h3>Inscription</h3>
                    </div> */}

                    <div className='formulaire-body'>

                        <Col md={8} className='m-auto'>
                            <FloatingLabel controlId="floatingInput" label="User Name" className="mb-3">
                                <Form.Control onChange={(value) => setusername(value.target.value)} type="email" placeholder="name@example.com" />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                <Form.Control onChange={(value) => setmail(value.target.value)} type="email" placeholder="name@example.com" />
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingInput" label="contact" className="mb-3">
                                <Form.Control onChange={(value) => setcontact(parseInt(value.target.value))} type="text" defaultValue='+261' />
                            </FloatingLabel>
                            <Row className='mt-4'>
                                <Col className='col-md-6 '>
                                    {
                                        listedepartement ?
                                            (
                                                <Form.Select key={'4c'} values={{ listedepartement }} onChange={(rep) => { setdepartement(rep.target.value); }} style={{ padding: "10px" }}>
                                                    <option key={'4sdf'}>Départemnet</option>
                                                    {listedepartement.map(option => {
                                                        return (
                                                            <option key={'q4'} style={{ color: option.color }} key={option.id} value={option.id}>
                                                                {option.intitule}
                                                            </option>
                                                        )
                                                    })}
                                                </Form.Select>

                                            ) : (
                                                <Form.Select key={'4c'} values={{ departement }} onChange={(rep) => { console.log(rep.target.value); }} style={{ padding: "10px" }}>
                                                    <option key={'4sdf'}>Waiting</option>
                                                </Form.Select>
                                            )
                                    }
                                </Col>
                                <Col className='col-md-6'>

                                    <Form.Select key={'4c'} values={{ departement }} onChange={(rep) => { setposte(rep.target.value) }} style={{ padding: "10px" }}>
                                        <option key={'4sdf'}>Poste Occupé</option>
                                        {listeposte.map(option => {
                                            return (
                                                <option key={'q4'} style={{ color: option.color }} key={option.id} value={option.labele}>
                                                    {option.labele}
                                                </option>
                                            )
                                        })}
                                    </Form.Select>
                                </Col>
                            </Row>

                        </Col>
                        <br></br>
                        {error &&
                            <Alert className='my-input' key='danger' variant='danger'>
                                {error}
                            </Alert>
                        }
                        <br />
                        <Button onClick={submiSignup} className='button mb-3'>Signup</Button>
                    </div>


                </div>

            </Col>
            <Col md={8}>
                <center>
                    <img src='./ministere.png' style={{ width: '60%', height: '60%' }}></img>
                </center>
            </Col>
        </Row >
    )
}
