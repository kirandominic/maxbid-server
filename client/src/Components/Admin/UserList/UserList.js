import React, { useEffect, useState } from 'react'
import AdminHome from '../AdminHome'
import "./userlist.css";
import Axios from 'axios';
import { Table } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import NavigationAdmin from '../../NavigationBar/Navadmin/NavAdmin'
import {SidebarData} from '../Sidebar'

function UserList() {
    const [listOfUsers, setlistOfUsers] =useState([
    
    ])
  let c=0;
  
    useEffect(()=>{
Axios.get("http://localhost:3001/getUsers").then((response)=>{
  setlistOfUsers(response.data);
})
    },[])
 
  function deleteuser(email)
  {
   if( window.confirm("do you want to delete"))
   {

    Axios.post("http://localhost:3001/deleteUser",{email}).then((response)=>{
      if(response.data.delete_status="sucess")
      {
        Axios.get("http://localhost:3001/getUsers").then((response)=>{
        setlistOfUsers(response.data);
        });
      }
      else if(response.data.delete_status="fail"){
        alert("User Not Deleted");
      }

    },[]);

   }
   else{

   }
  }
 
function approveuser(email){
  if( window.confirm("Sure to approve this user"))
  {

   Axios.post("http://localhost:3001/approveUser",{email}).then((response)=>{
     if(response.data.approve_status="sucess")
     {
       Axios.get("http://localhost:3001/getUsers").then((response)=>{
       setlistOfUsers(response.data);
       });
     }
     else if(response.data.approve_status="fail"){
       alert("Approval Unsucessfull");
     }

   },[]);

  }
  else{

  }
}
function checkApprove(status,url,email){
  if(status=="un_approved")
  {
    return(
<Popup trigger={<button type="button" className="btn btn-warning">Verify</button>} 
       position="bottom center">
         <div className='popup_div'>
        <img className = "popup_img"src={url} alt="not available" />
        <button value = {email} onClick={(e) => approveuser(e.target.value)}
        type="button" className="btn btn-dark approve_btn"
        >Approve User</button>
        </div>
      </Popup>
    )
  }
  else if(status=="admin"){
    return(
<button value = {email} 
        type="button" className="btn btn-success"
        >Admin</button>    )
  }
  else{
    return(
      <button value = {email} 
              type="button" className="btn btn-success"
              >Approved</button>    )
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
      <th>First Name</th>
      <th>Last Name</th>
      <th>Phone</th>
      <th>Address</th>
      <th>email</th>
      <th>Status</th>
    {/*} <th>Delete </th>{*/}
    </tr>
  </thead>
  <tbody>
{listOfUsers.map((user)=>{
  var url = "http://localhost:3001/Images/UserDocuments/" + user.id

  return(
    <tr>
      <td >{++c}</td>
      <td>{user.fname}</td>
      <td>{user.lname}</td>
      <td>{user.phone}</td>
      <td>{user.address}</td>
      <td>{user.email}</td>
      <td>{checkApprove(user.status,url,user.email)}
      </td>

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