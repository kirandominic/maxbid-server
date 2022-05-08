import React from 'react'
import NavHomeGuest from '../../NavigationBar/Navigation_Home_Guest/NavHomeGuest'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row } from 'react-bootstrap';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import img1 from '../../../Images/bg3.jpg'
import img2 from '../../../Images/bg5.jpg'
import { useState,useEffect } from 'react'
import * as axios from 'axios';


function HomeGuest() {
  const [search, setSearch] = useState(['']);

  const [productList, setProductList] = useState([]);

  useEffect(()=>{ 
   
    
     
        axios.get("http://localhost:3001/get-products").then((response) => {
          setProductList(response.data);
      });
  
    
  
  },[])
   
  return (
    <div className='bg'>      <Row>{<NavHomeGuest/>}</Row>
    <div>
    <Carousel showThumbs={false} autoPlay={true}>
        
                <div>
                    <img height="300px" width="100%" src={img1} alt="not AVAILABLE"/>
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
            
              if(value.expired==="no" && value.status != 'disabled')
              {

              var url = "http://localhost:3001/Images/Products/" + value.image;
              return(
                <div className = "product_list">
                  <div ClassName='imagebox'>
                    <img src={url}  width ="400px" height="400px" />

                   </div>
                   <div>
                  <label>Product   :{value.pname}</label><br/>
                  <label>Basic Bid   :{value.bid}</label><br/>
                  <label>Location    :{value.location}</label><br/>
                  <label>Information :{value.information}</label><br/>
                  <label>Highest bid :{value.high_bid}</label>
            

                  </div>
                </div>
              )
                
                }
            })}
    </div>
    </div>
  )
}

export default HomeGuest