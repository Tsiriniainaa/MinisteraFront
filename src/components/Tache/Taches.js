import './style.css';
import React, { useEffect, useState } from 'react';
import { Badge, Col, Form, Row } from 'react-bootstrap';
import CardTask from './cardTask/CardTask';
import ModalAddTache from './ModalAddTache';
import TacheService from './Service';
import { FadeLoader } from 'react-spinners'
import ServiceTask from './Service';
//route params
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ModalTacheEnRetard from './ModalTacheEnRetard';
import useSound from 'use-sound';
import pop from '../sound/create.mp3'
import Swal from 'sweetalert2';
import moment from 'moment';
const styleOver = {
    // transform: 'scale(0.99)',
    backgroundColor: '#d1dce5cf',
    // boxShadow: '5px 8px 20px 3px #5f5d5d',
    transitionDuration: '1.4s'
}

const optionsPriority = [
    { id: 1, name: "Bas" },
    { id: 2, name: "Moyen" },
    { id: 3, name: "Urgent" },
];
const optionsStatut = [
    { id: 1, name: "Todo" },
    { id: 2, name: "In Progress" },
    { id: 3, name: "Doing" },
];


export default function Taches(props) {
    const navigation = useNavigate();

    //paramas
    let { state } = useLocation();
    const idProjet = state.projet.id;
    // const idProjet = state.projet.id;

    console.log('HJHJHJHJHJVGVGVGv', state.projet);
    // alert(idProjet);
    //filtre
    const [statut, setstatut] = useState('');
    const [priority, setpriority] = useState('');
    // console.log('statut=--------==', priority);
    //task formater
    const [todo, settodo] = useState(null);
    const [inProgress, setinProgress] = useState(null);
    const [doing, setdoing] = useState(null);
    const [retard, setretard] = useState([]);

    /////////nombre stat\
    const [nombreTodo, setnombreTodo] = useState(0);
    const [nombreProgress, setnombreProrgess] = useState(0);
    const [nombreDoing, setnombreDoing] = useState(0);
    ////////////drag
    const [overTodo, setoverTodo] = useState(false);
    const [overProgress, setoverProgress] = useState(false);
    const [overDoing, setoverDoing] = useState(false);
    const [play] = useSound(pop);

    ///////////dataShowing
    const [showDataTodo, setshowDataTodo] = useState(null);
    const [showDataProgress, setshowDataProgress] = useState(null);
    const [showDataDoing, setshowDataDoing] = useState(null);

    //function==================================================
    const filtre = (event) => {

        // if (event.target.value.toLowerCase() === "") {
        //     setshowData(SousTache);
        // }
        // else {
        //     let rep = []
        //     setshowData(SousTache);
        //     SousTache.map(pop => {
        //         if ((pop.labele.toLowerCase().includes(event.target.value.toLowerCase()))) {
        //             // setSousTache(pop);
        //             rep.push(pop);
        //         }
        //     })
        //     setshowData(rep);
        // }
    }


    const handleSave = (tache) => {
        tache.ProjetId = idProjet;
        TacheService.save(tache).then((rep) => {
            settodo([...todo, rep.data]);
            console.log(rep);
        }).catch(err => {
            console.log('tsy nisave Taches; cause:', err)
        })
    }
    //////////////////////////////////////////////////mila jerena ////////////ato
    const handleActiver = (array) => {
        let newTodo = [];
        array.map(tache => {
            settodo(todo.filter(t => t.id !== tache.id));
        })
        // setinProgress([...inProgress, array]);
        // console.log('hahahha', newTodo);
        // settodo(newTodo);
        // setnombreTodo(newTodo.length);
        // tache.StatutId = 2;
        // setnombreProrgess(inProgress.length);

    }
    const handleUpdate = (tache) => {
        tache.ProjetId = idProjet;
        TacheService.update(tache).then((rep) => {
            switch (tache.StatutId) {
                case 1:
                    console.log(todo.filter(t => t.id !== tache.id));
                    // if()
                    // settodo([...todo, { tache }])
                    break;
                case 2:
                    console.log('HUUH', rep)

                    setinProgress(inProgress.filter(t => t.id !== tache.id));
                    setinProgress(rep);
                    break;
                case 3:
                    console.log('HUUH', rep)

                    setdoing(doing.filter(t => t.id !== tache.id));
                    setdoing(rep);
                    break;
                default:
                    break;
            }
        }).catch(err => {
            console.log('somme error in server side:', err)
        })
    }

    const handleDelete = (tache) => {
        console.log('delete', tache.StatutId);
        TacheService.delete({ id: tache.id })
            .then(rep => {
                switch (tache.StatutId) {
                    case 1:
                        settodo(todo.filter(t => t.id !== tache.id));
                        break;
                    case 2:
                        setinProgress(inProgress.filter(t => t.id !== tache.id));
                        break;
                    case 3:
                        setdoing(doing.filter(t => t.id !== tache.id));
                        break;
                    default:
                        break;
                }
            })
            .catch(err => {
                console.log(err);
            })
    }


    const draginOver = (e) => {
        e.stopPropagation();
        e.preventDefault();

        switch (e.target.className) {
            case 'Todo col':
                setoverTodo(true);
                break;
            case 'InProgress col':
                setoverProgress(true);
                break;
            case 'Doing col':
                setoverDoing(true);
                break;
            default:
                break;
        }
    }

    const dragDropped = (e, cyble) => {
        play();
        let data = e.dataTransfer.getData('tache');
        const tache = JSON.parse(data);
        // console.log(cyble);
        if (tache.StatutId === 1) { //mila alefa any am in Progress
            if (cyble === "progress") {
                const newTodo = todo.filter(t => t.id !== tache.id);
                settodo(newTodo);
                setnombreTodo(newTodo.length);
                tache.StatutId = 2;
                setinProgress([...inProgress, tache]);
                setnombreProrgess(inProgress.length);
                let data = { StatutId: 2, id: tache.id };
                ServiceTask.update(data);
            }
            else if (cyble === "doing") {
                // alert('Vous ne pouvez pas faire cette action')
                const newTodo = todo.filter(t => t.id !== tache.id);
                settodo(newTodo);
                setnombreTodo(newTodo.length);
                tache.StatutId = 3;
                setdoing([...doing, tache]);
                setnombreDoing(doing.length);
                let data = { StatutId: 3, id: tache.id };
                ServiceTask.update(data);
            }
        }
        ////////////////////////////////////////////////////////progress TO doing//////////////////////////////
        if (tache.StatutId === 2) {
            if (cyble === "todo") {
                // alert('vous ne pouvez pas arreter la progression de cette tache')
                const newProgress = inProgress.filter(t => t.id !== tache.id);
                setinProgress(newProgress);
                setnombreProrgess(newProgress.length);
                tache.StatutId = 1;
                settodo([...todo, tache]);
                setnombreTodo(todo.length);
                let data = { StatutId: 1, id: tache.id };
                ServiceTask.update(data);
            }
            if (cyble === "doing") { //////////////////////////////////////////////////////////////////controle si tuot les sous taches sont terminer 
                console.log('TARITEMENT', tache);
                ServiceTask.getAvancement(tache.id).then(rep => {
                    console.log('console', rep.data);

                    if (rep.data.total > rep.data.terminer) {
                        Swal.fire({
                            title: 'Terminer tout les checklists?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Terminer'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // play();
                                Swal.fire(
                                    'Terminer',
                                    'Tache terminer',
                                    'success'
                                ).then(() => {
                                    tache.StatutId = 3;
                                    const newProgress = inProgress.filter(t => t.id !== tache.id);
                                    setinProgress(newProgress); setnombreProrgess(newProgress.length);
                                    setdoing([...doing, tache]); setnombreDoing(doing.length);
                                    let data = { StatutId: 3, id: tache.id };
                                    ServiceTask.update(data).then(rep => {
                                        ServiceTask.endAllChecklist(tache.id);
                                    });

                                })
                            }
                        })

                    }

                    else {
                        const newProgress = inProgress.filter(t => t.id !== tache.id);
                        setinProgress(newProgress);
                        setnombreProrgess(newProgress.length);
                        tache.StatutId = 3;
                        setdoing([...doing, tache]);
                        setnombreDoing(doing.length);
                        let data = { StatutId: 3, id: tache.id };
                        ServiceTask.update(data);
                    }

                })
                    .catch(err => {
                        console.log('error', err);
                    })
            }
        }
        /////////////////////////////////////////////////////////////////////doing/////////////////
        if (tache.StatutId === 3) {
            if (cyble === "progress") {
                const newdoing = doing.filter(t => t.id !== tache.id);
                setdoing(newdoing);
                setnombreDoing(newdoing.length);
                tache.StatutId = 2;
                setinProgress([...inProgress, tache]);
                setnombreProrgess(inProgress.length);
                let data = { StatutId: 2, id: tache.id };
                ServiceTask.update(data);
            }
            else if (cyble === "todo") {
                const newdoing = doing.filter(t => t.id !== tache.id);
                setdoing(newdoing);
                setnombreDoing(newdoing.length);
                tache.StatutId = 1;
                settodo([...todo, tache]);
                setnombreTodo(todo.length);
                let data = { StatutId: 1, id: tache.id };
                ServiceTask.update(data);
            }
        }
        setoverTodo(false);
        setoverProgress(false);
        setoverDoing(false);
    }
    useEffect(() => {
        TacheService.getTacheByIdProjet(idProjet)
            .then((rep) => {
                if (typeof rep.data.todo.length !== 'undefined') setnombreTodo(rep.data.todo.length);
                if (typeof rep.data.inProgress.length !== 'undefined') setnombreProrgess(rep.data.inProgress.length);
                if (typeof rep.data.doing.length !== 'undefined') setnombreDoing(rep.data.doing.length);
                setTimeout(() => {
                    settodo(rep.data.todo);
                    setretard(rep.data.retard);
                    setdoing(rep.data.doing);
                    setinProgress(rep.data.inProgress);
                    // setnahazodata(true)
                }, 500);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])



    return (
        <div className='all'>
            {/* //////////RETARD//////////// */}
            <ModalTacheEnRetard retard={retard} handleActiver={handleActiver} handleDelete={handleDelete} />

            <Row>
                <div className='filtre' /*style={{ backgroundColor: `${state.projet.color}` }}*/>
                    <Col sm={12} className={'headerFiltreTache'}>
                        {/* // gauche */}
                        <Col sm={4} id={'filtregauche'}>
                            <div className="icons">
                                <img onClick={() => navigation('/projets')} className="ministeraSary" src='../ministere.png'></img>
                            </div>
                            <div className="m-3">
                                <Row>
                                    <Col>
                                        <h4 style={{ color: 'white', fontFamily: 'sans-serif' }} >{state.projet.titre}</h4>
                                    </Col>
                                    <Col>
                                        <i style={{ color: 'white', fontFamily: 'sans-serif' }} >{moment(state.projet.debut).format('DD/MM/YYYY')}</i>
                                    </Col>
                                    <Col>
                                        <i style={{ color: 'white', fontFamily: 'sans-serif' }} >{moment(state.projet.fin).format('DD/MM/YYYY')}</i>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        {/* ////////////////////////eto no manomboka */}
                        {/* // droite */}
                        <Col sm={4}>
                            <div className="m-2">
                                <img className='findLogo' src='../search.png' />
                                <input className='findBarTask'></input>
                            </div>
                            {/* <Button>Rechercher</Button> */}
                        </Col>


                        <Col sm={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <div className='m-3 ml-3'>
                                <Form.Select values={{ optionsPriority }} onChange={(rep) => { setpriority(rep.target.value); }} style={{ width: "145px", padding: "10px" }}>
                                    <option>Priorite</option>
                                    {optionsPriority.map(option => {
                                        return (
                                            <option style={{ color: option.color }} key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
                            </div>

                            <div className='m-3'>
                                <Form.Select className='drop' values={{ optionsStatut }} onChange={(rep) => { setstatut(rep.target.value); }} style={{ width: "145px", padding: "10px" }}>
                                    <option>Statut</option>
                                    {optionsStatut.map(option => {
                                        return (
                                            <option style={{ color: option.color }} key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        )
                                    })}
                                </Form.Select>
                            </div>

                            <div className="m-4 mt-5">
                                <h5 style={{ color: 'white' }} >Ministeran'ny Rano</h5>
                                <p style={{ color: 'white', fontSize: '12px' }} >Copyright : © meah 2022 </p>
                                <p> </p>
                            </div>
                        </Col>
                    </Col>
                </div >
            </Row >

            {/* ////////////////////// */}


            < Row className='m-2 ' >
                <Col style={overTodo ? styleOver : {}} className='Todo' droppable='true' onDragOver={e => draginOver(e)} onDrop={e => dragDropped(e, 'todo')}>
                    <Row>
                        <Col className='m-auto'>
                            <h5>Todos</h5>
                            <Badge>{nombreTodo}</Badge>
                        </Col>
                        <Col md={3} style={{ display: 'contents' }}>
                            <ModalAddTache handleSave={handleSave} />
                        </Col>
                    </Row>
                    {
                        todo ? (
                            todo.map(tache => {
                                return <CardTask key={tache.id} tache={tache} handleUpdate={handleUpdate} handleDelete={handleDelete} />
                            })
                        ) : (
                            <center className='mt-5'>
                                <FadeLoader className='p-5' color="#36d7b7" />
                            </center>
                        )
                    }
                </Col>

                <Col style={overProgress ? styleOver : {}} className='InProgress' droppable onDragOver={e => draginOver(e)} onDrop={e => dragDropped(e, 'progress')} >
                    <h5>In progress</h5>
                    <Badge>{nombreProgress}</Badge>


                    <div>
                        {
                            inProgress ? (
                                inProgress.map(tache => {
                                    return <CardTask key={tache.id} tache={tache} handleUpdate={handleUpdate} handleDelete={handleDelete} />
                                })
                            ) : (
                                <center className='mt-5'>
                                    <FadeLoader className='p-5' color="#36d7b7" />
                                </center>
                            )
                        }
                    </div>
                </Col>

                <Col style={overDoing ? styleOver : {}} className='Doing' droppable onDragOver={e => draginOver(e)} onDrop={e => dragDropped(e, 'doing')}>
                    <h5>Doing</h5>
                    <Badge>{nombreDoing}</Badge>
                    {
                        doing ? (
                            doing.map(tache => {
                                return <CardTask key={tache.id} tache={tache} handleUpdate={handleUpdate} handleDelete={handleDelete} />
                            })
                        ) : (
                            <center className='mt-5'>
                                <FadeLoader className='p-5' color="#36d7b7" />
                            </center>
                        )
                    }
                </Col>

            </Row >
        </div>
    );
}