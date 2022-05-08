import React, { useEffect, useState } from 'react'
import AdminHome from '../AdminHome'
import "./productlist.css";
import Axios from 'axios';
import { Table } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import {SidebarData} from '../Sidebar'
import NavigationAdmin from '../../NavigationBar/Navadmin/NavAdmin'


function UserList() {
    const [listOfProducts, setlistOfProducts] =useState([
    
    ])
  let c=0;
  
    useEffect(()=>{
        Axios.get("http://localhost:3001/get-products").then((response) => {
            setlistOfProducts(response.data);
        });
    },[])
 

  return (
    
    <div>
      
      <div>    <NavigationAdmin/>
</div>
<div className='sidebar'>
    <ul className='sidebarlist'> 
    {SidebarData.map((val,key)=>{
    return(
      <li key={key}
      className="row"  
      id={window.location.pathname == val.link ? "active" :""}
      onClick={()=>{window.location.pathname = val.link}}>
         <div className='a'>{val.icon}</div><div className='b'> {val.title}</div>
          
          </li>
    );
})}
</ul>
</div>
       <div className='usertable'>
       <Table striped bordered hover variant="dark">
  <thead>
    <tr>
      <th>#</th>
      <th>Product Name</th>
      <th>Information</th>
      <th>Status</th>
      <th>Date</th>
    {/*} <th>Delete </th>{*/}
    </tr>
  </thead>
  <tbody>
{listOfProducts.map((product)=>{
  var url = "http://localhost:3001/Images/UserDocuments/" + product.id

  return(
    <tr>
      <td >{++c}</td>
      <td>{product .pname}</td>
      <td>{product.information}</td>
      <td>{product.status}</td>
      <td>{product.date}</td>


     {/*} <td><button type="button" className="btn btn-danger" value = {user.email} onClick={(e) => deleteuser(e.target.value)}>Delete</button></td>{*/}
    </tr>
  )
})}
 </tbody>
</Table>
       </div>
    </div>
  )
}

export default UserList