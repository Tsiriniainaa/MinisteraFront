import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
// import {huhu} from 'huhu';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // ou un autre thème
import 'primereact/resources/primereact.min.css'; 
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Projet from './components/Projet/Projet';
import Taches from './components/Tache/Taches';
import Parametre from './components/Parametre/Parametre';
import MyMap from './components/MyMap/MyMap';
import GestionUser from './components/GestionUser/GestionUser';
import Compte from './components/Compte/Compte';
import Bac from './components/BacMap/bac';
import Graph from './components/BacMap/graph';
import { useEffect } from 'react';
import Infra from './components/Infra/Infra';
import InfraMap from './components/Infra/InfraMap';
import Departement from './components/departement/departement';
import TableauBac from './components/BacMap/tableauBac';
import Insert from './components/BacMap/insert_data';
import CarteSituation from './components/BacMap/CarteSituation';
import TableauPlanification from './components/BacMap/TableauPlanification';
import TableauPoints from './components/BacMap/TableauPoints';
import ListeBonbone from './components/BacMap/ListeBonbone';

function App() {
 
  useEffect(() => {
      document.title = `Meah-Suivi-Operationnel`;
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/map" element={<MyMap />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projets" element={<Projet />} />
          <Route path="/tachesById" element={<Taches />} />
          {/* <Route path="/tachesById/:idProjet" element={<Taches />} /> */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/gestionUser" element={<GestionUser />} />
          <Route path="/parametre" element={<Parametre />} />
          <Route path="/profil" element={<Compte />} />
          {/* //carte suivi assaignisssement */}
         
          <Route path="/departement" element={<Departement />} />
          <Route path="/cartographie_meah" element={<Bac />} />
          <Route path="/evolution" element={<Graph />} />
          <Route path="/insert_data" element={<Insert />} />
          <Route path="/tableau_evolution" element={<TableauBac/>} />
          <Route path="/infra" element={<Infra />} />
          <Route path="/carto_infra" element={<InfraMap />} />
          <Route path="/planification-carte" element={<CarteSituation />} />
          <Route path="/planification-tableau" element={<TableauPlanification />} />
          <Route path="/statistique-points-situation" element={<TableauPoints />} />
          <Route path="/liste-ravitaillement" element={<ListeBonbone />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
