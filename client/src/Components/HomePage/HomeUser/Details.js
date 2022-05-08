import { useParams } from "react-router-dom";
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Axios from 'axios';
import { Table } from 'react-bootstrap';
import { Alert, Row } from 'react-bootstrap';

import NavUser from '../../NavigationBar/NavigationUser/NavUser';

import { useState,useEffect } from 'react'
import * as axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import '../../User/AddProduct/ViewProduct/viewproduct.css';
function Details() {
     const [listOfUsers, setlistOfUsers] =useState([
    
    ])
    useEffect(()=>{ 
    
      const token = localStorage.getItem('token')
      console.log(token);
      if(!token){
        localStorage.removeItem('token');
        window.location.pathname = "/login";}
        else{ 
          Axios.get("http://localhost:3001/getUsers").then((response)=>{
            setlistOfUsers(response.data);
        });};
    
      
    
    },[])
        const [listOfBids, setlistOfbids] =useState([])
     
      let c=0;
    const [viewproductobj, setView] = useState([]);
    const  {pid}  = useParams();
    
    function checkBid(bid)
    {
      if(bid===0){
       return (<span>NO bids yet</span>);
     }
      else{
       return (<span>{bid}</span>);
 
      }
    }
    function checkstatus(status)
    {
      var name;
      var phone;
      var email;
      if(status === "none"){
       return (<span>Status : Bidding in progress</span>);
     }
     else if(status === "noBids"){
      return (<span>Status : No Bids on this product</span>);
     }
      else{
        listOfUsers.forEach(element2=>{
          
          if(element2._id === status)
          {
            
          name = element2.fname;
          phone = element2.phone;
            email = element2.email;

          }
        })
        return (<div><span>Winner Name : {name}</span><br></br><span>Phone: {phone}</span><br></br><span>Email:{email}</span></div>);

      }
    }
   const notifybid = () => toast("Bid Placed sucessfully");
 
 var bidamount;
   function setBid(bid){
     bidamount = bid;
     console.log(bidamount);
   }
    function bidSubmit(e){
     var pid=localStorage.getItem("pid");
     axios.post("http://localhost:3001/get-bid",{pid:pid}).then((response) => {
       if((response.data[0].bid)>(bidamount))
       {alert("amount is less than basic bid")}
       else{
         var uid= localStorage.getItem("uid");
         axios.post("http://localhost:3001/place-bid",{bid:bidamount,uid:uid,pid:pid}).then((response) => {
 if(response.data.bidstatus === "sucess")
 console.log("bid placed sucessfully")
 {notifybid()
 }        })
 
       }
     })
     
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
    console.log(token);
    if(!token){
      localStorage.removeItem('token');
      window.location.pathname = "/login";}
      else{ 
        axios.post("http://localhost:3001/get-bids",{id:pid}).then((response)=>{
            setlistOfbids(response.data);
      });
        axios.post("http://localhost:3001/get-product",{id:pid}).then((response) => {
          setView(response.data);
      });
    };
  
    

      }, []);
    
  return (
    
    <div>
      <Row>{<NavUser/>}</Row>
{/* <p>{pid}</p> */}
        {viewproductobj.map((value,key) =>{
            
              var url = "http://localhost:3001/Images/Products/" + value.image;
              return(
                <div className = "product_list1">
                  <div>
                    <img className='imagebox' width ="400px" height="400px"src={url}/>

                   </div>
                   <div className = "box1">
                  <label>Product   :{value.pname}</label><br/>
                  <label>Basic Bid   :{value.bid}</label><br/>
                  <label>Location    :{value.location}</label><br/>
                  <label>Information :{value.information}</label><br/>
                  <label>Highest bid :{checkBid(value.high_bid)}</label><br></br>
                  <label>{checkstatus(value.winner)}</label>
                  </div>
                  <div className = "box2"> 
                 

        </div>
                </div>
              )
                
                
            })}
                <div className = "bidlist">
                <Table striped bordered hover variant="dark">
  <thead>
    <tr>
      <th>#</th>
      <th>User</th>
      <th>Date</th>
      <th>Bid</th>
    </tr>
  </thead>
  <tbody>
{listOfBids.map((bids)=>{

  return(
    <tr>
      <td >{++c}</td>
      <td>{bids.name}</td>
      <td>{bids.date}</td>
      <td>{bids.bid}</td>
       </tr>
  )
})}
 </tbody>
</Table>
                </div>  


    </div>

  )
}

export default Details