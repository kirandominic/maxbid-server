import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Row } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import img1 from '../../../Images/bg3.jpg'
import img2 from '../../../Images/bg5.jpg'
import NavUser from '../../NavigationBar/NavigationUser/NavUser';
import { useState,useEffect } from 'react'
import * as axios from 'axios';
import './HomeUser.css'
import Popup from 'reactjs-popup';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";


 function HomeUser() {
   
  const [search, setSearch] = useState(['']);
   function checkBid(bid)
   {
     if(bid===0){
      return (<span>NO bids yet</span>);
    }
     else{
      return (<span>{bid}</span>);

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
      if(!bidamount){
        {alert("please enter the amount")}

      }
      else if((bidamount<1)|| (bidamount>3450000000)){
        alert("Invalid amount");
      }
      else if((response.data[0].bid)>(bidamount))
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
  const [productList, setProductList] = useState([]);

  useEffect(()=>{ 
    
      const token = localStorage.getItem('token')
      console.log(token);
      if(!token){
        localStorage.removeItem('token');
        window.location.pathname = "/login";}
        else{ 
          axios.get("http://localhost:3001/get-products").then((response) => {
            setProductList(response.data);
        });};
    
      
    
    },[])

  return (
    
    <div className='bghome'>  <Row>{<NavUser/>}</Row>
    <ToastContainer
position="top-center"
autoClose={1000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss={false}
draggable={false}
pauseOnHover
/>
    <div>
    <Carousel showThumbs={false} autoPlay={true}>
        
                <div>
                    <img  height="300px" width="100%"src={img1} alt="not AVAILABLE"/>
                </div>
               
                <div>
                    <img height="300px" width="100%"src={img2} />
                </div>
            </Carousel>
            <input className="form-control mr-sm-2" type="search" placeholder="Search" onChange = {(event) => {
              setSearch(event.target.value)
            }}aria-label="Search"/>
            {productList.filter((val)=>{
              if(search == ""){
                return val;
              }
              else if(val.pname.toLowerCase().includes(search.toLowerCase())){
                return val
              }
            }).map((value,key) =>{
              if(value.email===localStorage.getItem("email") || value.status === 'disabled')
              {}
              
              else if(value.expired==="no")
              {

              var url = "http://localhost:3001/Images/Products/" + value.image;
              return(
                <div className = "product_list">
                  <div>
                     <Link to={`/View-product/${value._id}`} ><img ClassName='imagebox' width ="400px" height="400px"src={url}/></Link>

                   </div>
                   <div>
                  <label>Product   :{value.pname}</label><br/>
                  <label>Basic Bid   :{value.bid}</label><br/>
                  <label>Location    :{value.location}</label><br/>
                  <label>Information :{value.information}</label><br/>
                  <label>Highest bid :{checkBid(value.high_bid)}</label>
                  <form onSubmit={bidSubmit}>
        <div className="input1">
       
        </div>
        
        <div className="wrap">
        <Popup  trigger={<button type="button" className="btn btn-warning sell">Bid</button>} 
        
        position="right center">
          <div className="form3" > 
          <input type="number" name='bid'  id="bid" className="form__input1" autoComplete="off" onChange={(event) => {
                    setBid(Number(event.target.value));
                  }}/>
          <button className="button" value = {value._id} onClick={(event) => {
                              localStorage.setItem('pid', event.target.value);


                    bidSubmit();
                  }}>Place bid</button>
 
        
        

       </div>
         
       </Popup> 

        </div>
        </form>

                  </div>
                </div>
              )
                
                }
            })}
    </div>
    </div>
  )
}

export default HomeUser