import React, { useEffect, useState } from 'react'

import { Row, Col } from 'react-bootstrap';

import './Dashboard.css';
import Nav from '../Nav/Nav';
import Header from '../header/Header';
// chart
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import VariablePie from "highcharts/modules/variable-pie.js";
//service

import Service from './Service';
import Retard from './Retard/Retard';
VariablePie(Highcharts);
const mois = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
require('highcharts/modules/accessibility')(Highcharts);
export default function Dashboard() {
    //problem
    const [donutsData, setdonutsData] = useState([]);
    //avance retard
    const [avance, setavance] = useState(0);
    const [retard, setretard] = useState(0);
    //effectif
    const [todoNumber, settodoNumber] = useState(0);
    const [progressNumber, setprogressNumber] = useState(0);
    const [doingNumber, setdoingNumber] = useState(0);
    const [totalNumber, settotalNumber] = useState(0);
    useEffect(() => {
        Service.getProbleme()
            .then(rep => {
                // setprobleme(rep.data);
                let dataDonutsPb = [];
                console.log('MM', rep);
                for (let i = 0; i < rep.data.length; i++) dataDonutsPb.push([rep.data[i].labele, parseInt(rep.data[i].nombre)])
                setdonutsData(dataDonutsPb);
            })
            .catch(err => {
                console.log(err);
            })
        Service.getAvanceRetard()
            .then(rep => { setavance(rep.data.avance[0].count); setretard(rep.data.retard[0].count) })
            .catch(err => { alert('error in get avncemnt') })
        Service.getEffectif()
            .then(rep => {
                console.log('effectiff', rep);
                settodoNumber(rep.data.todo);
                setprogressNumber(rep.data.progress);
                setdoingNumber(rep.data.doing);
                settotalNumber(rep.data.total);
            })
            .catch(err => { alert('getEffectif error') })
    }, []);
    // console.log(retard);
    const donuts = {
        // chart: {
        //     plotBackgroundColor: null,
        //     plotBorderWidth: 0,
        //     plotShadow: false
        // },
        chart: {
            type: 'variablepie'
        },
        title:
        {

            text: 'Statistiques des <br>problèmes',
            align: 'center',
            verticalAlign: 'middle',
            y: 60
        },

        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        // credits: {
        //     enabled: false
        // },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%'
            }
        },
        series: [{
            type: 'pie',
            name: 'pourcentage',
            innerSize: '50%',
            data: donutsData,
            showInLegend: true
        }]
        // ,
        // color: {
        //     #90ed7d
        // }
    };
    // console.log('DOOOO', donutsData);
    // const donuts = {
    //     chart: {
    //         type: 'variablepie'
    //     },
    //     title: {
    //         text: 'Countries compared by population density and total area, 2022.'
    //     },
    //     tooltip: {
    //         headerFormat: '',
    //         pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
    //             'Area (square km): <b>{point.y}</b><br/>' +
    //             'Population density (people per square km): <b>{point.z}</b><br/>'
    //     },
    //     series: [{
    //         minPointSize: 10,
    //         innerSize: '20%',
    //         zMin: 0,
    //         name: 'countries',
    //         data: donutsData

    //     }]
    // };

    const batton = {
        chart: {
            type: 'column'
        },
        title: false,
        // {
        // text: 'Proprietés des taches par mois'
        // },
        // subtitle: {
        //     text: 'Detail Planning'
        // },
        xAxis: {
            categories: mois,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Pourcentage %'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'todo',
            color: 'Red',
            // data: arrayRep['high']
            data: [12, 23, 19, 9, 4, 2, 4, 5, 6, 7, 29, 9]
        }, {
            name: 'progress',
            // data: arrayRep['medium']
            data: [8, 2, 13, 19, 4, 15, 21, 5, 10, 19, 21, 2]

        }, {
            name: 'doing',
            color: 'Green',
            // data: arrayRep['low']
            data: [10, 15, 11, 13, 12, 16, 12, 13, 15, 19, 20, 13]
        }
        ]
    };
    return (
        <Row className='container-fluid'>
            {/* ///////////////////////component include NAVIGATION */}
            <Col md={2}>
                <Nav></Nav>
            </Col>
            {/* /////////////////CONTAINER */}
            <Col md={10} className={'container'}>
                {/* //heder */}
                <Row>
                    <Header></Header>
                </Row>
                {/* //box statistique de sexe and stat general*/}
                <Row>
                    <Col md={3}>

                        <div className="stat-avance">
                            <Row>
                                <Col>
                                    <div className={'box-logo'}>
                                        <div className={'logoLate'} style={{ backgroundColor: '#FFB400' }}>
                                            <center>
                                                <img className="iconStat" src='./late.png'></img>
                                            </center>
                                        </div>
                                        <p>Retard</p>
                                        <h2>{retard}</h2>
                                        <Retard statut='retard'></Retard>
                                    </div>
                                </Col>
                                <Col>
                                    <div>

                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={3}  >
                        <div className="stat-avance">
                            <Row>
                                <Col>
                                    <div className={'box-logo'}>
                                        <div className={'logoLate'} style={{ backgroundColor: '#56CA00' }}>
                                            <center>
                                                <img className="iconStat" src='./late.png'></img>
                                            </center>
                                        </div>
                                        <p>En Avance</p>
                                        <h2>{avance}</h2>
                                        <Retard statut='avance'></Retard>

                                    </div>
                                </Col>
                                <Col>
                                    <div>
                                        {/* <BiTask style={{ width: "40%", height: "auto" }} /> */}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col md={6} className="stat-general" >
                        <Row>
                            <h5 style={{ color: 'grey' }}>Statistiques des Taches</h5>
                            <p>Ce mois</p>
                        </Row>
                        <Row>
                            {/* <div id='box-icon-stat'> */}
                            <Col md={3}>
                                <Row>
                                    <Col md={5}>

                                        <div className={'cadreImage'} style={{ backgroundColor: '#56CA00' }}>
                                            <center>
                                                <img className="iconStat" src='./done.png'></img>
                                            </center>
                                        </div>
                                        {/* test */}
                                    </Col>
                                    <Col md={7}>
                                        <p style={{ fontSize: 'small' }}>Effectif</p>
                                        <h5 style={{ fontSize: 'small' }}>{totalNumber}</h5>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3}>
                                <Row>
                                    <Col md={5}>

                                        <div className={'cadreImage'} style={{ backgroundColor: '#7367F0' }}>
                                            <center>
                                                <img className="iconStat" src='./task.png'></img>
                                            </center>
                                        </div>
                                        {/* test */}
                                    </Col>
                                    <Col md={7}>
                                        <p style={{ fontSize: 'small' }}> Todo</p>
                                        <h5 style={{ fontSize: 'small' }} >{todoNumber}</h5>
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={3}>
                                <Row>
                                    <Col md={5}>

                                        <div className={'cadreImage'} style={{ backgroundColor: '#FFB400' }}>
                                            <center>
                                                <img className="iconStat" src='./fail.png'></img>
                                            </center>
                                        </div>
                                        {/* test */}
                                    </Col>
                                    <Col md={7}>
                                        <p style={{ fontSize: 'small' }}>   In Progress</p>
                                        <h5 style={{ fontSize: 'small' }}>{progressNumber}</h5>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3}>
                                <Row>
                                    <Col md={5}>

                                        <div className={'cadreImage'} style={{ backgroundColor: '#56CA00' }}>
                                            <center>
                                                <img className="iconStat" src='./done.png'></img>
                                            </center>
                                        </div>
                                        {/* test */}
                                    </Col>
                                    <Col md={7}>
                                        <p style={{ fontSize: 'small' }}>Doing</p>
                                        <h5 style={{ fontSize: 'small' }}>{doingNumber}</h5>
                                    </Col>
                                </Row>
                            </Col>

                            {/* </div> */}
                        </Row>
                    </Col>
                </Row>
                {/* /////////////////////1 et 2  */}
                <Row>
                    <Col md={6}>
                        <div className="bas-sexe1">
                            <h5>Statistiques des statuts par mois</h5>
                            <HighchartsReact highcharts={Highcharts} options={batton} />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="bas-sexe2">
                            <h5>Statistiques des problèmes</h5>
                            <HighchartsReact highcharts={Highcharts} options={donuts} />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="Urgence">
                        <h5>Urgent</h5>
                    </Col>
                </Row>
            </Col>

        </Row >
    )
}
