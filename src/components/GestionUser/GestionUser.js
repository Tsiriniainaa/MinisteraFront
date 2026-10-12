import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, Table, Form, Button, Toast } from 'react-bootstrap';

// import './Projet.css';
import Nav from '../Nav/Nav';
import Header from '../header/Header';
//component
//service
//redux
import { BeatLoader } from 'react-spinners';
import ServiceForAll from '../ServiceForAll';
import AuthService from '../Auth/Auth.service';
import moment from 'moment';
import Swal from 'sweetalert2';
let active = 2;
let items = [];
for (let number = 1; number <= 5; number++) {
    items.push(
        <Pagination.Item key={number} active={number === active}>
            {number}
        </Pagination.Item>,
    );
}
const options = [
    { id: 1, name: "Bas" },
    { id: 2, name: "Moyen" },
    { id: 3, name: "Urgent" },
];

export default function GestionUser() {

    const [departement, setdepartement] = useState([])
    const [role, setrole] = useState([])
    const [allUser, setallUser] = useState([]);

    function handleActiver(user) {
        Swal.fire({
            title: `${user.username}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Activer!'
        }).then((result) => {
            if (result.isConfirmed) {
                // play();
                Swal.fire({
                    toast: true,
                    title: 'Activation en cours!',
                    icon: 'success',
                }
                ).then(() => {
                    AuthService.activation(user.email)
                        .then(rep => {
                            console.log(rep);
                            document.location.reload();
                        })
                        .catch(err => console.log('tsy mety:', err))
                })
            }
        })
    }

    useEffect(() => {
        ServiceForAll.getDept()
            .then(rep => {
                setdepartement(rep.data);
            })
            .catch(err => {
                console.log(err);
            });
        ServiceForAll.getRole()
            .then(rep => {
                setrole(rep.data);
            })
            .catch(err => {
                console.log(err);
            });
        AuthService.getAllUser()
            .then(rep => {
                setallUser(rep.data);
            })
            .catch(err => {
                console.log('sdfsdf', err);
            })
    }, [])
    //FUNCTION



    const ButtonLabel = (comp) => {

        let activer = {
            text: 'Activer',
            variant: 'primary'
        };
        let desactiver = {
            text: 'Desactiver',
            variant: 'danger'
        }
        if (comp) return desactiver;
        return activer;
    }

    return (
        <Row className='container-fluid'>
            <Col sm={2}>
                <Nav></Nav>
            </Col>
            <Col sm={10} className={'container'}>
                <Row>
                    <Header></Header>
                </Row>
                <Row>
                    <Col sm={12} className="ListProjet">
                        <Row className='p-3'>
                            <Col>
                                <h5>Gestions des utilisateurs</h5>
                                <Pagination size="sm">{items}</Pagination>
                            </Col>
                            <Col sm={3}>
                            </Col>
                        </Row>
                        {/* <hr></hr> */}
                        <Row>
                            <Col sm={12} className="containerListProjet">
                                <Table striped bordered hover >
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>email</th>
                                            <th>Departement</th>
                                            <th>Role</th>
                                            <th>Date Inscription</th>
                                            <th>Activer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allUser.map(user => {
                                                return (

                                                    <tr key={user.username + 'tr'}>
                                                        <td key={user.username + '1'}>{user.username}</td>
                                                        <td key={user.email + '1'}>{user.email}</td>
                                                        <td key={user.username + '4er'}>
                                                            {/* <Form.Select values={{ options }} onChange={(rep) => { setpriority(rep.target.value); }} style={{ padding: "10px" }}> */}
                                                            <Form.Select key={user.username + '4c'} values={{ departement }} onChange={(rep) => { console.log(rep.target.value); }} style={{ padding: "10px" }}>
                                                                <option key={user.username + '4sdf'}>Départemnet</option>
                                                                {departement.map(option => {
                                                                    return (
                                                                        <option key={user.username + 'q4'} style={{ color: option.color }} key={option.id} value={option.id}>
                                                                            {option.intitule}
                                                                        </option>
                                                                    )
                                                                })}
                                                            </Form.Select>
                                                        </td>
                                                        <td key={user.username + '4'}>
                                                            <Form.Select values={{ role }} onChange={(rep) => { console.log(rep.target.value); }} style={{ padding: "10px" }}>
                                                                <option key={user.username + '4w'} >Role</option>
                                                                {role.map(option => {
                                                                    return (
                                                                        <option key={user.username + '4v'} style={{ color: option.color }} key={option.id} value={option.id}>
                                                                            {option.name}
                                                                        </option>
                                                                    )
                                                                })}
                                                            </Form.Select>
                                                        </td>
                                                        <td key={user.email + '13'}>
                                                            <center>
                                                                {moment(user.createdAt).format('DD/MM/YYYY')}
                                                            </center>
                                                        </td>
                                                        <td key={user.email + '1a'}>
                                                            {console.log('ButtonLabel', ButtonLabel(user.isActive).text)}
                                                            <Button style={{ width: '100%' }} variant={ButtonLabel(user.isActive).variant} onClick={() => handleActiver(user)} >{ButtonLabel(user.isActive).text}</Button>{' '}
                                                            {/* <Button style={{ width: '40%' }} variant='success' onClick={() => handleActiver(user)} >Modifier</Button> */}
                                                        </td>

                                                    </tr>
                                                )

                                            })
                                        }

                                    </tbody>
                                </Table>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Col>
        </Row >
    )
}
