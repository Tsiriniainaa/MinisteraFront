import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, Table, Button } from 'react-bootstrap';

// import './Projet.css';
import Nav from '../Nav/Nav';
import Header from '../header/Header';
//component

//service
import { BeatLoader } from 'react-spinners';
import Service from './service';
// import UserService from '../../service/UserService.js'
import { useNavigate } from 'react-router';
import Chart from '../Chart/chart';
let active = 1;
let items = [];
for (let number = 1; number <= 5; number++) {
    items.push(
        <Pagination.Item key={number} active={number === active}>
            {number}
        </Pagination.Item>,
    );
}

export default function Departement() {
    const navigate = useNavigate();
    const [dept, setdept] = useState([]);

    useEffect(() => {
        Service.getAllDept().then(rep => {
            console.log(rep.data);
            setdept(rep.data);
        })

    }, []);

    //FUNCTION
    function handleDept(iddept) {

        let storage = {
            // id: rep.data.id,
            DepartementId: iddept,
            // email: rep.data.email,
            // username: rep.data.username,
            // accessToken: rep.data.accessToken
        }
        console.log('storage', storage);
        localStorage.setItem('users', JSON.stringify(storage));
        navigate('/projets');

    }

    return (
        <Row className='container-fluid'>


            {/* ///////////////////Modification password */}

            <Col md={2}>
                <Nav></Nav>
            </Col>
            <Col md={10} className={'container'}>
                <Row>
                    <Header></Header>
                </Row>
                <Row>
                    <Col md={12} className="ListProjet">
                        <Row className='p-3'>
                            <Col>
                                <h5>Liste des Départements MEAH </h5>
                                <Pagination size="sm">{items}</Pagination>
                            </Col>
                            <Col md={3}>
                            </Col>
                            <Col md={1} className='mt-3'>
                            </Col>
                        </Row>
                        <hr></hr>
                        <Row>
                            {/* <Col md={2} ></Col> */}
                            <Col md={12} >

                                {
                                    dept &&
                                    dept.map(d => {
                                        return <>
                                            {/* <td>{d.intitule}</td>
                                                    <td ><center><Button onClick={() => handleDept(d.id)}>Voir détail</Button></center></td> */}
                                            <Chart departement={d}></Chart>
                                            <br></br>
                                            <hr></hr>
                                            <hr></hr>
                                            <hr></hr>
                                            <br></br>

                                        </>

                                    })
                                }
                            </Col>
                            {/* <Col md={2} ></Col> */}
                        </Row>

                    </Col>
                </Row>
            </Col >
        </Row >
    )
}
