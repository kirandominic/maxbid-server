import React from 'react'
import'./NavUser.css'
import Popup from 'reactjs-popup';
import {useFormik} from 'formik';
import { useState,useEffect } from 'react'

import * as yup from 'yup';
import * as axios from 'axios';
function NavUser() {
  const [name, setName] =useState('');
  function logout()
{
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  window.location.pathname="/login";
} 
useEffect(()=>{ 
   
  const email1 = localStorage.getItem('email');
  
  console.log(email1);
  axios.post("http://localhost:3001/getUserName",{email:email1}).then((response) => {
    console.log(response.data.name);
    setName(response.data.name);
});
  
  },[])


  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const formik = useFormik({
    initialValues:{
      pname:'',
      bid:'',
      days:'',
      location:'',
      information:'',
      
    },
    validationSchema : yup.object({
      pname : yup.string('Please Provide a valid Name').required('Please provide Product name'),
      bid : yup.number('Please enter a Numerical Value').required('Please provide the basic Bid').min(0),
      days : yup.number().integer().required('Provide the number of days').min(1),
      location : yup.string().max(150,'Location Should not exceed 200 Characters').required('Please provide the Location for Picking the product'),
      information : yup.string().required(),
    }),
    onSubmit:values=>{
      console.log("formik called");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", fileName);
      formData.append("pname",values.pname);
      formData.append("bid",values.bid);
      formData.append("days",values.days);
      formData.append("location",values.location);
      formData.append("information",values.information);
      formData.append("email",localStorage.getItem("email"));
      axios.post('http://localhost:3001/addproduct',formData).then((response)=>{
       // console.log(response);
       if(response.data.error_status=="no_photo")
        {
          alert("Please upload the photo of the poduct")
        }
        else if(response.data.error_status=="wrong_format")
        {
          alert("Please upload an image")
        }
        if(response.data.status=="ok")
        {
          alert("Product added sucessfully.")
          window.location.pathname = "/Home"
        }
       });
    }
  })
  
  
  
  
  return (
    <div><div className='navigation-user'><nav className="navbar navbar-expand-lg navbar-light bg-light">
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
      <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
        <li className="nav-item active">
          <a className="nav-link" href="/Home ">Home <span className="sr-only"></span></a>
        </li>
       
        <li className="nav-item">
        <Popup  trigger={<button type="button" className="btn btn-warning sell">Sell</button>} 
        
       position="bottom left">
         <div className="form3" > 
        <form onSubmit={formik.handleSubmit}>

        <div className="input1">   
          <input type="text" name='pname' {...formik.getFieldProps("pname")}  id="pname" className="form__input1" autoComplete="off" placeholder=" "/>
          {formik.touched.bid && formik.errors.pname ? <span style={{color:'red'}}>{formik.errors.pname}</span> : null}
          <label htmlFor="pname" className="form__label1">Product Name</label>
        </div>
        <div className="input1">   
          <input type="text" name='bid' {...formik.getFieldProps("bid")}  id="bid" className="form__input1" autoComplete="off" placeholder=" "/>
          {formik.touched.bid && formik.errors.bid ? <span style={{color:'red'}}>{formik.errors.bid}</span> : null}
          <label htmlFor="lname" className="form__label1">Basic Bid</label>
        </div>

        <div className="input1">
          <input type="text" name='days'{...formik.getFieldProps("days")}  id="days" className="form__input1" autoComplete="off" placeholder=" "/>
          {formik.touched.days && formik.errors.days ? <span style={{color:'red'}}>{formik.errors.days}</span> : null}
          <label htmlFor="days" className="form__label1">Days of bidding</label>
        </div>

        <div className="input1">
        <input type="text" name='location'{...formik.getFieldProps("location")} id="location" className="form__input1" autoComplete="off" placeholder=" "/>
        {formik.touched.location && formik.errors.location ? <span style={{color:'red'}}>{formik.errors.location}</span> : null}
        <label htmlFor="location" className="form__label1">location for picking the Product</label>
        </div>
        <div className="input1">
        <input type="text" name='information'{...formik.getFieldProps("information")} id="information" className="form__input1" autoComplete="off" placeholder=" "/>
        {formik.touched.information && formik.errors.information ? <span style={{color:'red'}}>{formik.errors.information}</span> : null}
        <label htmlFor="information" className="form__label1">Informatio about the product</label>
        </div>
        <div className="input1">

        <input className='form-control form-control-lg fileup' type="file" name="file" accept="image/*"onChange={(event) => {
              setFile(event.target.files[0]);
              setFileName(event.target.files[0].name);

            }} />
                      {formik.touched.phone && formik.errors.file ? <span style={{color:'red'}}>{formik.errors.file}</span> : null}

            </div>
        <div className="wrap1">
          <button className="button1" type='submit'>Submit</button>
        </div>
        </form>
      </div>
        
      </Popup>        </li>
        <li className="nav-item">
          <a className="nav-link Register" href="/history">Your Products</a>
        </li>
        
        <li className="nav-item">
          <a className="nav-link name" href="/Home">{name.toUpperCase()}</a>
        </li>
        <li className="nav-item">
        <button type="button" className="btn btn-warning logout" onClick={logout}>Logout</button>      </li>
      </ul>
        
    </div>
  </nav></div></div>
  )
}

export default NavUser