import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Table, FloatingLabel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import AuthService from '../Auth/Auth.service';
import Header from '../header/Header';
import Nav from '../Nav/Nav';
// import './parametre.css'

const Compte = () => {
    //////formulaire
    // const [password, setpassword] = useState('');
    // const [projet, setProjet] = useState(null);
    let user = localStorage.getItem('users');
    user = JSON.parse(user);
    console.log('XDXD', user);


    const oldUserName = user.username;
    const [email, setemail] = useState(user.email);
    const [username, setusername] = useState(user.username);

    const [password, setpassword] = useState('');
    const [newPass, setnewPass] = useState('');

    const handleUpdate = () => {
        if (password === '' || newPass === '' || email === '' || username === '') {
            Swal.fire({
                toast: true,
                title: 'Veuiller remplir tout les champs!',
                timer: 1500,
                icon: 'warning',
            })
        }
        else {

            let data = {
                email,
                username,
                password,
                newPass,
                oldUserName
            }
            AuthService.udpateUser(data)
                .then(rep => {
                    console.log(rep);
                })
                .catch(err => {
                    console.log(err);
                })
        }
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
                                <h1>Modifier votre compte</h1>
                                <hr></hr>
                                <Row>
                                    <Col md={8}>
                                        <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                                            <Form.Control onChange={(value) => setusername(value.target.value)} defaultValue={user.email} type="email" placeholder="name@example.com" />
                                        </FloatingLabel>

                                        <FloatingLabel controlId="floatingInput" label="User Name" className="mb-3">
                                            <Form.Control onChange={(value) => setusername(value.target.value)} defaultValue={user.username} type="email" placeholder="name@example.com" />
                                        </FloatingLabel>

                                        <FloatingLabel controlId="floatingPassword" label="Password">
                                            <Form.Control onChange={(value) => setpassword(value.target.value)} type="password" placeholder="Password" />
                                        </FloatingLabel>
                                        <br></br>
                                        <FloatingLabel controlId="floatingPassword" label="New Password">
                                            <Form.Control onChange={(value) => setnewPass(value.target.value)} type="password" placeholder="Password" />
                                        </FloatingLabel>
                                        <br></br>

                                        <Button onClick={handleUpdate} >Enregistrer</Button>
                                    </Col>

                                    <Col md={4}>
                                        <div className='m-auto' style={{ width: '200px', height: '200px', borderRadius: '15px', backgroundColor: 'grey' }}>

                                            <img src='./ministere.png' style={{ width: '100%', height: '100%' }}></img>
                                            <img src='./ministere.png' style={{ width: '100%', height: '100%' }}></img>

                                        </div>
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                    </Row>
                </Col>
            </Row >
        </div >
    );
}

export default Compte;
