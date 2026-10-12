import { React, useEffect,  useState } from 'react';
import { Radio } from 'antd';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useMap, MapContainer, Marker, Popup, TileLayer, LayersControl   } from 'react-leaflet'
import './styles.css';
import 'leaflet/dist/leaflet.css';
import { Control, Icon ,Layer} from 'leaflet';
import ServiceBac from './service';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Nav from '../Nav/Nav'
import Legende from './Legende';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

const center = [-18.865447, 47.519533]

let labelEtatBac = [
    { labele: 'Tout', id: 0 },
    { labele: 'Vide', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'Plein', id: 3 },
    // { labele: 'trois quart', id: 3 },
    // { labele: 'Plein', id: 4 },
    // { labele: 'Trop Plein', id: 5 },
    // { labele: 'Débordement', id: 6 }
];

let labelEtatDebordement = [
    { labele: 'tout', id: 0 },
    { labele: 'Quart', id: 1 },
    { labele: 'Demi', id: 2 },
    { labele: 'trois quart', id: 3 },
    { labele: 'Plein', id: 4 }, 
    { labele: 'Trop Plein', id: 5 },
    { labele: 'Débordement', id: 6 }
];


  const getDate = function(labdata) {
    const options = {year : 'numeric', month : 'long', day : 'numeric'};
    let dates = [];
    for (let i = 0; i < labdata.length; i++) {
       dates.push(new Date(labdata[i].date).toLocaleDateString('fr-FR', options));
    }
    return dates;
  };
  
  const getAll = function(labdata) {
    let all = [];let tout = [];let quart = [] ;let demi = [] ;let trois_quart = [] ;let plein = [] ;
    const options = {year : 'numeric', month : 'long', day : 'numeric'};
    let datess = [];
    //console.log("_______________________________________"+labdata[0]);
    let trop_plein = []; let debordement = [];let totalBonbone = [];let nondef = [];
      for (let i = 0; i < labdata.length; i++) {
       datess.push(new Date(labdata[i].date).toLocaleDateString('fr-FR', options));
         tout.push(labdata[i].effectif[0]);
         quart.push(labdata[i].effectif[1]);
        demi.push(labdata[i].effectif[2]);
        trois_quart.push(labdata[i].effectif[3]);
         plein.push(labdata[i].effectif[4]);
        trop_plein.push(labdata[i].effectif[5]);
        // debordement.push(labdata[i].effectif[6]);
        debordement.push(labdata[i].effectif[7]);
        totalBonbone.push(labdata[i].effectif[9]);
        nondef.push(labdata[i].effectif[8]);

        console.log(debordement);
      }
      all.push(tout);
      all.push(quart);
      all.push(demi);
      all.push(trois_quart);
      all.push(plein);
      all.push(trop_plein);
      all.push(debordement);
      all.push(datess);
      all.push(nondef);
      all.push(totalBonbone);
      // all.push(datess);
      //console.log(all);
      return all; 
    }

export default function Bac() {
    const [valuelabelEtatBac, setvaluelabelEtatBac] = useState(0);
    const [valuelabelEtatDebordement, setvaluelabelEtatDebordement] = useState(0);
    //state
    const [data, setData] = useState([]);
    const [bacs, setbac] = useState([]);
    const [debut, setDebut] = useState(new Date());
    const [fin, setFin] = useState(new Date());
    const [finR, setFinR] = useState(new Date());
    const [debutR, setDebutR] = useState(new Date());
    const [effectif, seteffectif] = useState([]);
    const [labdata, setLabdata] = useState([]);
    let df = JSON.parse(localStorage.getItem('mapView'));
    const [mapType, setMapType] = useState(df);
    const [erreurD, setErreurD] = useState('');
    const [erreurF, setErreurF] = useState('');

    // console.log(df,'kjhgkjhg');
    
    // if(mapType){
    // } 

    const onMapTypeChange = (e) => {
        setMapType(e.target.value);
        localStorage.setItem('mapView', JSON.stringify(e.target.value));
        // setMapType(df)
        window.location.reload();

        // setMapType()
    };
    function analyseDate(date,setDate,setErreur){
      setErreur('');
      setDate(date);
      ServiceBac.isValide(date)
      .then(rep=>{
          setErreur(rep.data.erreur);
      }).catch(err => {
              console.log('error', err);
          })
  }

  function fetch(journee) {
      let requestFiltre = { etatBac: valuelabelEtatBac, etatDebordement: valuelabelEtatDebordement, datedebut: debut ,datefin : fin,journee:1}
      ServiceBac.getEvolutionStatistique(requestFiltre)
          .then(rep => {
            console.log(JSON.stringify(rep.data.evolution));
              setLabdata(rep.data.evolution);
              setFinR(fin);
              setDebutR(debut);
          })
          .catch(err => {
              console.log('error', err);
          })
  }

    const options = {
      chart: {
        type: 'column',
        backgroundColor: '#f4f4f4',
      },
      title: {
        text: '',
        style: {
          color: '#333',
          fontSize: '24px',
        },
      },
      xAxis: {
        categories: getAll(labdata)[7].map((date, index) => {
          const additionalLabel = getAll(labdata)[6][index];
          const additionalLabeltOTAL = getAll(labdata)[9][index];
          return additionalLabel ? `<div>${date}<br/>${additionalLabel} : <span style='font-weight:bold;' >${additionalLabeltOTAL}</span></div>` : date;
        }),
        labels: {
          useHTML: true,
          style: {
            color: '#666',
          },
        },
      },
      yAxis: {
        allowDecimals:false,
        title: {
          text: '',
          style: {
            color: '#666',
          },
        },
      },
      series: [
        // {
        //   name: 'Vide',
        //   data: getAll(labdata)[1],
        //   color: 'red',
        // },
        {
          name: 'Demi',
          data: getAll(labdata)[2],
          color: 'blue',
        },
        {
          name: 'Plein',
          data: getAll(labdata)[3],
          color: 'green',
        },
        // {
        //   name: 'ND',
        //   data: getAll(labdata)[8],
        //   color: 'GRAY',
        // },
        // {
        //   name: 'Trop Plein',
        //   data: getAll(labdata)[5],
        //   color: 'red',
        // },
        // {
        //   name: 'Debordement',
        //   data: getAll(labdata)[6],
        //   color: 'violet',
        // },
      ],
    };
     //view  
    return (
        <div>
            <Row className='container-fluid'>
                <Col md={2}>
                    <Nav></Nav>
                </Col>
                <Col md={10} className={'container'}>
                    <Row>
                        <Col md={12} className="bg-white filtre">
                            <div className='title_style'>
                              Visualisation graphique de l'évolution de l'état des bonbonnes 
                              <br/> en date du {debutR.toLocaleDateString()} au {finR.toLocaleDateString()}
                            </div>
                            <Row className='p-3'style={{backgroundColor:'white'}}>
                                <Col md={10} className="d-flex justify-content-around">
                                    <Form.Select
                                        values={{ valuelabelEtatBac }} onChange={async (rep) => { await setvaluelabelEtatBac(rep.target.value); }}
                                        style={{ width: "145px", padding: "10px" }}>
                                        {/* <option value={0} >Etat Bac</option> */}
                                        {labelEtatBac && labelEtatBac.map(option => {
                                            return (
                                                <option style={{ color: option.color }} key={option.id} value={option.id}>
                                                    {option.labele}
                                                </option>
                                            )
                                        })}
                                    </Form.Select>
                                    {/* <Form.Select
                                        values={{ valuelabelEtatDebordement }} onChange={async (rep) => { await setvaluelabelEtatDebordement(rep.target.value); }}
                                        style={{ width: "145px", padding: "10px" }}>
                                        <option value={0}>Débord</option>
                                        {labelEtatDebordement && labelEtatDebordement.map(option => {
                                            return (
                                                <option style={{ color: option.color }} key={option.id} value={option.id}>
                                                    {option.labele}
                                                </option>
                                            )
                                        })}
                                    </Form.Select> */}

                                    <Row>
                                         <DateTimePicker className="dateCss" onChange={(event)=> analyseDate(event,setDebut,setErreurD)} value={debut} />
                                        {erreurD !=='' &&
                                             <div className='erreur'>
                                                {erreurD}
                                           </div>  
                                        }
                                    </Row>
                                    <Row>
                                    <DateTimePicker className="dateCss" onChange={(event)=> analyseDate(event,setFin,setErreurF)} value={fin} />
                                    {erreurF !=='' &&
                                             <div className='erreur'>
                                                {erreurF}
                                           </div>  
                                        }
                                        </Row>
                                        {erreurF =='' && erreurD =='' && 
                                            <>
                                            <Button variant="outline-success" onClick={()=>fetch(0)}>Filtrer</Button>
                                            {/* <Button variant="outline-primary" onClick={()=>fetch(1)}>Tout la journée</Button> */}
                                            </>
                                        }
                                        {erreurF !='' || erreurD !='' && 
                                            <>
                                            <Button variant="outline-success" onClick={()=>fetch(0)} disabled={true}>Filtrer</Button>
                                            {/* <Button variant="outline-primary" onClick={()=>fetch(1)} disabled={true}>Tout la journée</Button> */}
                                            </>
                                        }</Col>
                            </Row>
                            <br/><br/>
                            <Row>
                            <Col md={12} >
                               <HighchartsReact highcharts={Highcharts} options={options} />
                            </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >



    )
}
