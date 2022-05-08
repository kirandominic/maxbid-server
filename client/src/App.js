import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter as Router, Routes,	Route} from "react-router-dom";
import Register from './Components/Register/Register';
import Brand from './Components/NavigationBar/NavBrand/Brand';
import { Row } from 'react-bootstrap';
import AdminHome from './Components/Admin/AdminHome';
import UserList from './Components/Admin/UserList/UserList';
import PromoteProduct from './Components/User/PromoteProduct/PromoteProduct'
import ReportedProducts from './Components/Admin/ReportedProduct/ReportedProduct';
import ViewReportedProduct from './Components/Admin/ReportedProduct/ViewReportedProduct';

import ProductList from './Components/Admin/ProductList/ProductList';
import Login from './Components/Login/Login';
import HomeGuest from './Components/HomePage/HomeGuest/HomeGuest';
import HomeUser from './Components/HomePage/HomeUser/HomeUser';
import History from './Components/HomePage/HomeUser/History'
import ViewProduct from './Components/User/AddProduct/ViewProduct/ViewProduct';
import Details from './Components/HomePage/HomeUser/Details'
import Bids from './Components/HomePage/HomeUser/Bids';
function App() {
  return (

    <Router>
         

    <div className="App">
      <Row>{<Brand/>}</Row>

      <Routes>
        <Route path = "/Register" element={<Register/>}/>
        <Route path = "/UserList" element={<UserList/>}/>
        <Route path = "/ProductList" element={<ProductList/>}/>
        <Route path = "/reportedProducts" element={<ReportedProducts/>}/>
        <Route path = "/promoteProduct/:pid" element={<PromoteProduct/>}/>



        <Route path = "/Login" element={<Login/>}/>
        <Route path = "/AdminHome" element={<AdminHome/>}/>
        <Route path = "/Home-Guest" element={<HomeGuest/>}/>
        <Route path = "/" element={<HomeGuest/>}/>

        <Route path = "/Home" element={<HomeUser/>}/>
        <Route path = "/History" element={<History/>}/>
        <Route path = "/View-product/:pid" element={<ViewProduct/>}/>
        <Route path = "/View-Reported-product/:pid/:reason" element={<ViewReportedProduct/>}/>

        <Route path = "/Details/:pid" element={<Details/>}/>
        <Route path = "/Bids" element={<Bids/>}/>


      </Routes>
    </div>
  
    </Router>
  );
}

export default App;
