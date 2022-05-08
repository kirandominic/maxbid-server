import React from 'react'
import { Alert, Row } from 'react-bootstrap';
import NavUser from '../../NavigationBar/NavigationUser/NavUser';
import GooglePayButton from '@google-pay/button-react';
import "./promoteproduct.css"
import { useParams } from "react-router-dom";

import { useState,useEffect } from 'react'
import * as axios from 'axios';

function PromoteProduct() {
  
  const  {pid}  = useParams();
  const [viewproductobj, setView] = useState([]);
  const [isDaysValid, setisDaysValid] = useState('valid');
  const [totalcost, setCost] = useState(0);


var daysRemaining;
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
  function checkBid(bid)
  {
    if(bid===0){
     return (<span>NO bids yet</span>);
   }
    else{
     return (<span>{bid}</span>);

    }
  }
  function daysremainig(date3){
    var date1 = new Date(date3);
    var date2 = new Date();
      
    // To calculate the time difference of two dates
    var Difference_In_Time = date1.getTime() - date2.getTime();
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));
    daysRemaining = Difference_In_Days;
    localStorage.setItem('daysRemaining',daysRemaining);
  }
  function calculateDays(days){
    console.log("days "+days);
    const remainingDays = localStorage.getItem('daysRemaining');
  
    if(!days){
      console.log("inside not days")
      localStorage.setItem('days',0);

    }

    else if(remainingDays<days){
      alert("Your Advertisement is only active for "+localStorage.getItem('daysRemaing')+" Please Enter a valid number of days");
      localStorage.setItem('days',0);
      setisDaysValid('invalid');
      setCost(0);
    }
    else{
      localStorage.setItem('days',days);
      setisDaysValid('valid');
    }

  }
 function calculateCost(){
   if(isDaysValid === 'invalid'){
     return (<span>Invalid Days</span>)

   }
   else if(isDaysValid === 'valid')
   {
     
     var days = localStorage.getItem('days');
     console.log("days"+days);
     if(days === 0)
     {
      setCost(0);

     }
     else{
     var cost = days *12;

     setCost(cost);
     
     }
   }


 }
 function UpdateProductPromotion(){
  axios.post("http://localhost:3001/UpdateProductPromotion",{pid:pid}).then((response) => {
    if(response.data.bidstatus === "success")
    console.log("promo updated placed sucessfully");
    alert("Payment was successful and the product is promoted.");
    window.location.pathname = "/history";

            })
 }
  return (

    
    <div >
       <Row>{<NavUser/>}</Row>
      <hr />
      <div className="paymentbox">
      {viewproductobj.map((value,key) =>{
            
            var url = "http://localhost:3001/Images/Products/" + value.image;
            return(
              <div className = "product_list3">
                <div>
                  <img  width ="400px" height="400px"src={url}/>

                 </div>
                 <div className = "box1">
                <label>Product   :{value.pname}</label><br/>
                <label>Basic Bid   :{value.bid}</label><br/>
                <label>Location    :{value.location}</label><br/>
                <label>Information :{value.information}</label><br/>
                <label>Highest bid :{checkBid(value.high_bid)}</label><br></br>
                {daysremainig(value.date)}
                <label ClassName="daysremaininglabel" for="days">Active Days Remaining {daysRemaining}</label><br/>

                </div>
                <div className = "box2"> 
               

      </div>
              </div>
            )
              
              
          })}
<div className="payment">
      <label for="rate">Rate per day: 12 rupees</label><br/>

      <label for="days">Days</label>

      <input type="number" className="days" onChange={(event) => {
                    calculateDays(event.target.valueAsNumber);
                    calculateCost();
                  }}></input><br/>
      <label for="cost">Total Cost  {totalcost}</label>


      <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Maxbid Admin',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: String(totalcost),
            currencyCode: 'INR',
            countryCode: 'IN',
          },
          callbackIntents: [ 'PAYMENT_AUTHORIZATION'],
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('Success', paymentRequest);
          UpdateProductPromotion();


        }}
        onPaymentAuthorized={paymentData => {
            console.log('Payment Authorised Success', paymentData)
            return { transactionState: 'SUCCESS'}
          }
        }
    
        existingPaymentMethodRequired='false'
        buttonColor='black'
        buttonType='Buy'
      />
      </div>

      
      </div>
      </div>
  )
}

export default PromoteProduct