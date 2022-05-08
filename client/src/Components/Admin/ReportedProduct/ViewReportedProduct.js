import { useParams } from "react-router-dom";
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Axios from 'axios';
import { Table } from 'react-bootstrap';
import { Alert, Row } from 'react-bootstrap';
import NavAdmin from "../../NavigationBar/Navadmin/NavAdmin";
import Popup from 'reactjs-popup';


import { useState,useEffect } from 'react'
import * as axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
// import './viewproduct.css';
function ViewReportedProduct() {
 
    const [listOfBids, setlistOfbids] =useState([])
    useEffect(()=>{ 

      const token = localStorage.getItem('token')
      console.log(token);
      if(!token){
        localStorage.removeItem('token');
        window.location.pathname = "/login";}
        else{ 
          Axios.post("http://localhost:3001/get-bids",{id:pid}).then((response)=>{
            setlistOfbids(response.data);
        });};
    
      
    
    },[])
  let c=0;
const [viewproductobj, setView] = useState([]);
const { pid } = useParams();
const { reason } = useParams();

function checkBid(bid)
{
  if(bid===0){
   return (<span>NO bids yet</span>);
 }
  else{
   return (<span>{bid}</span>);

  }
}
function disableProduct(){
    if( window.confirm("Sure to disable this Product"))
  {
    Axios.post("http://localhost:3001/disableProduct",{pid:pid}).then((response)=>{
        if(response.data.disable_status="success")
        {
            toast("This Product Disabled successfully");

                setTimeout( function ( ) {  window.location.reload();}, 1000 ); 
        }
        else if(response.data.disable_status="fail"){
          alert("Approval Unsucessfull");
        }
   
      },[]);
  }
}


useEffect(() => {
    const token = localStorage.getItem('token')
console.log(token);
if(!token){
  localStorage.removeItem('token');
  window.location.pathname = "/login";}
  else{ 
    axios.post("http://localhost:3001/get-product",{id:pid}).then((response) => {
      setView(response.data);
  });
};



  }, []);
  function checkStatus(status)
  {
      if(status ==='approved')
      {
          return (<button type="button" className="btn btn-warning" onClick={disableProduct}>Disable This Product</button>);
      }
      else if(status ==='disabled')
      {
        return (<button type="button" className="btn btn-warning" onClick={disableProduct}>Disabled</button>);
    }

  }

return (
 <div>
{/* //     <p>{pid}</p> */}
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
<Row>{<NavAdmin/>}</Row>
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
              <label>Highest bid :{checkBid(value.high_bid)}</label>
              <label>Reported Reason :{reason}</label>

              </div>
              <div className = "box2"> 
            {checkStatus(value.status)}

      

              
                   

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

export default ViewReportedProduct