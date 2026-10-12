import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Container, Form, Navbar, NavDropdown, Row, Table } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';

import ServiceInfra from './service';


const critere = [
    { column: 'region', name: 'Région' },
    { column: 'district', name: 'District' },
    { column: 'communes', name: 'Commune' },
    { column: 'localite', name: 'Localité' },
    { column: 'milieu', name: 'Milieu' },
]


const Infra = () => {
    const [infra, setinfra] = useState([]);
    const [filtre, setfiltre] = useState("");
    const [showData, setshowData] = useState([]);

    useEffect(() => {

        ServiceInfra.getAllInfra()
            .then(rep => {
                setinfra(rep.data);
                // setinfra(test);
                // test
                setshowData(rep.data);
                // console.log(rep);
            })
            .catch(err => {
                console.log('some err in infra', err);
                alert(err.message);
            })

    }, []);
    //function 

    const getFiltre = event => {
        // alert(filtre)
        if (event.toLowerCase() === "") {
            setshowData(infra);
        }
        else {
            let rep = []
            setshowData(infra);
            infra.map(pop => {
                // alert(pop[`${filtre}`])
                if ((pop[`${filtre}`].toLowerCase().includes(event.toLowerCase()))) {
                    rep.push(pop);
                }
            })
            setshowData(rep);
        }
    }




    return (
        <div>
            <Row>
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand href="#">  <img className="ministeraSary" src='../ministere.png'></img></Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="me-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                                <Nav.Link href="/infra">Tableau</Nav.Link>
                                <Nav.Link href="/carto_infra">Cartografier</Nav.Link>
                            </Nav>
                            <Form.Select
                                values={{ filtre }} onChange={async (rep) => { await setfiltre(rep.target.value); }}
                                style={{ width: "145px", padding: "10px" }}>
                                <option value={0}>Filtre</option>
                                {critere.map(option => {
                                    return (
                                        <option key={option.column} value={option.column}>
                                            {option.name}
                                        </option>
                                    )
                                })}
                            </Form.Select>
                            <Form className="mx-3 d-flex">
                                <Form.Control
                                    onChange={(rep) => getFiltre(rep.target.value)}
                                    style={{ width: "200px", padding: "11px" }}
                                    type="search"
                                    placeholder="Filtre"
                                    aria-label="Search"
                                />
                            </Form>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Row>
            <Row>
                {/* <hr></hr> */}
                <center>
                    <h3 style={{ padding: '10px', margin: '10px', color: 'grey' }}><i>Infrastructure Inaugurable</i></h3>
                </center>
            </Row>
            <Row className='m-2 '>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th><i>Région</i></th>
                            <th><i>District</i></th>
                            <th><i>Commune</i></th>
                            <th><i>Localité</i></th>
                            <th><i>Milieu</i></th>
                            <th><i>Points  d'eau</i></th>
                            <th><i>Nb bénéf</i> </th>
                            <th><i>Type infra</i> </th>
                            <th><i>Type Travaux</i> </th>
                            <th><i>Type gestion</i> </th>
                            <th><i> Montant Ariary</i> </th>
                            <th><i>Financement</i></th>
                            <th><i>Date prévue</i> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            showData && (
                                showData.map(inf => {
                                    return (
                                        <tr>
                                            <td>{inf.region}</td>
                                            <td>{inf.district}</td>
                                            <td>{inf.communes}</td>
                                            <td>{inf.localite}</td>
                                            <td>{inf.milieu}</td>
                                            <td>{inf.nb_point_eau}</td>
                                            <td>{inf.nb_benef}</td>
                                            <td>{inf.type_infra}</td>
                                            <td>{inf.type_travaux}</td>
                                            <td>{inf.type_gestion}</td>
                                            <td>{inf.montant_reel}</td>
                                            <td>{inf.financement}</td>
                                            <td>{inf.date_prevue}</td>
                                        </tr>
                                    )
                                })
                            )
                        }

                    </tbody>
                </Table>
            </Row>
        </div>
    );
}

export default Infra;
