import React, { useEffect, useState } from 'react'
import AdminHome from '../AdminHome'
// import "./userlist.css";
import Axios from 'axios';
import { Table } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import { Link } from "react-router-dom";
import NavigationAdmin from '../../NavigationBar/Navadmin/NavAdmin'
import {SidebarData} from '../Sidebar'


function ReportedProduct() {
    const [listOfReports, setlistOfReports] =useState([
    
    ])
  let c=0;
  
    useEffect(()=>{
Axios.get("http://localhost:3001/getReports").then((response)=>{
  setlistOfReports(response.data);
})
    },[])
 
//   function deleteuser(email)
//   {
//    if( window.confirm("do you want to delete"))
//    {

//     Axios.post("http://localhost:3001/deleteUser",{email}).then((response)=>{
//       if(response.data.delete_status="sucess")
//       {
//         Axios.get("http://localhost:3001/getUsers").then((response)=>{
//         setlistOfUsers(response.data);
//         });
//       }
//       else if(response.data.delete_status="fail"){
//         alert("User Not Deleted");
//       }

//     },[]);

//    }
//    else{

//    }
//   }
 
// function approveuser(email){
//   if( window.confirm("Sure to approve this user"))
//   {

//    Axios.post("http://localhost:3001/approveUser",{email}).then((response)=>{
//      if(response.data.approve_status="sucess")
//      {
//        Axios.get("http://localhost:3001/getUsers").then((response)=>{
//        setlistOfUsers(response.data);
//        });
//      }
//      else if(response.data.approve_status="fail"){
//        alert("Approval Unsucessfull");
//      }

//    },[]);

//   }
//   else{

//   }
// }
function checkStatus(status,pid,reason){
  if(status=="unchecked")
  {
    return(
        <Link to={`/View-Reported-product/${pid}/${reason}`} ><button type="button" className="btn btn-danger">Unchecked</button></Link>

    )
  }
  else if(status=="checked"){
    return(
<button type="button" className="btn btn-warning">Checked</button>   )
  }



}
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
      <th>Reason</th>
      <th>Date</th>
      <th>Status</th>

      
    {/*} <th>Delete </th>{*/}
    </tr>
  </thead>
  <tbody>
{listOfReports.map((report)=>{

  return(
    <tr>
      <td >{++c}</td>
      <td>{report.name}</td>
      <td>{report.reason}</td>
      <td>{report.date}</td>
      <td>{checkStatus(report.status,report.pid,report.reason)}</td>

    

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

export default ReportedProduct