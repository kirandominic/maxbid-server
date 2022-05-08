import React from 'react'
import { useState,useEffect } from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import img1 from '../../../Images/bg3.jpg'
import img2 from '../../../Images/bg5.jpg'
import NavUser from '../../NavigationBar/NavigationUser/NavUser';
import { Alert, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as axios from 'axios';
import { Link } from "react-router-dom";



function Bids() {
    const [userBid, setBid] = useState([]);
    // const [product, setProduct] = useState([]);
    var product;

    function getProduct(pid){
        axios.post("http://localhost:3001/get-bidded-products",{pid:pid}).then((response) => {
            product = response.data;
            console.log(product);

        
    });

    }


    useEffect(()=>{ 
        const uid = localStorage.getItem('uid');
        const token = localStorage.getItem('token')
        console.log(token);
        if(!token){
          localStorage.removeItem('token');
          window.location.pathname = "/login";}
          else{ 
              console.log(uid);
            axios.post("http://localhost:3001/get-user-bids",{uid:uid}).then((response) => {
                console.log(response.data);
              setBid(response.data);
          });
        
        };
      
        
        
        },[])
  return (
    <div>
            <div className='bghome'>  <Row>{<NavUser/>}</Row>
            </div>

        <Carousel showThumbs={false} autoPlay={true}>
        
        <div>
            <img  src={img1} alt="not AVAILABLE"/>
        </div>
       
        <div>
            <img src={img2} />
        </div>
    </Carousel>
    {  userBid.map((value,key) =>{
           const productid = value.pid;
            getProduct(productid);
            return(
                <div>
                <p>sdsadaddsgdsfasbfhkabfh</p>
                <p>sdsadaddsgdsfasbfhkabfh</p>
                <p>sdsadaddsgdsfasbfhkabfh</p>
                <p>sdsadaddsgdsfasbfhkabfh</p>
                </div>

            )
                 
        }
    )}
    </div>
  )
}

export default Bids