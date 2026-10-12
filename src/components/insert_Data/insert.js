import React, { useState } from "react"; 
import Nav from '../Nav/Nav' 
import { read, utils, writeFile } from 'xlsx';
import { useNavigate } from "react-router-dom";
import serviceCamion from "./service";
import Swal from 'sweetalert2';

const Insert_data = () => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setData(rows);
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }
    // const utcDays = Math.floor(45301 - 25569);
    // const utcValue = utcDays * 86400;
    // const dateInfo = new Date(utcValue * 1000);

    // console.log(dateInfo);
    const handleExport = () => {
        console.log(data);
        serviceCamion.insert(data).then(rep => {
            Swal.fire({
                toast: false,
                title: "Data insert successfully",
                timer: 3000,
                icon: 'info',
            })
        }).catch(err=>{
            console.log(err);
        });
        
        // navigate("/cartographie_meah");
    }

    const [datas, setDatas] = useState([]);

    const handleImports = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;
                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    setDatas(rows);
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }
    // const utcDays = Math.floor(45301 - 25569);
    // const utcValue = utcDays * 86400;
    // const dateInfo = new Date(utcValue * 1000);

    // console.log(dateInfo);
    const handleExports = () => {
        console.log(datas);
        serviceCamion.insert_resume(datas).then(rep => {
            Swal.fire({
                toast: false,
                title: "Data insert successfully",
                timer: 3000,
                icon: 'info',
            })
        }).catch(err=>{
            console.log(err);
        });
        
        // navigate("/cartographie_meah");
    }

    return (
        <>
        <div className="row">
            <div className="col-md-2">
                <Nav></Nav>
            </div>
             <div className="col-md-10">
                <div className="row mb-2 mt-5">
                    <div className="col-sm-6 offset-3">   
                        <div className="row">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <h4>Inserer rapports d'activités</h4>
                                    <div className="custom-file">
                                        <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                                    </div>
                                    <button onClick={handleExport} className="btn btn-primary float-right">
                                    Import <i className="fa fa-download"></i>
                                    </button>
                                </div>
                                <br></br>
                                <br></br>
                                <br></br>
                                <div className="input-group">
                                    <h4>Inserer résumé mouvement</h4>
                                    <div className="custom-file">
                                        <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImports}
                                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                                    </div>
                                    <button onClick={handleExports} className="btn btn-primary float-right">
                                    Import <i className="fa fa-download"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div>
        </>
        

    );
};

export default Insert_data;
