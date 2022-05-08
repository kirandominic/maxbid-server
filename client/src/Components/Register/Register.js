import * as axios from 'axios';
import './Register.css';
import {useFormik} from 'formik';
import * as yup from 'yup';

import React, { useState } from 'react'

import NavRegister from '../NavigationBar/NavRegister/NavRegister';


function Register() {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const formik = useFormik({
    initialValues:{
      fname:'',
      lname:'',
      phone:'',
      address:'',
      district:'',
      state:'',
      email:'',
      password:'',
      cpassword:'',
    },
    validationSchema : yup.object({
      fname : yup.string().required('Please provide the First Name'),
      lname : yup.string().max(30,'Last Name Should not exceed 20 Characters').required('Please provide the Last Name'),
      phone : yup.number().min(12,'Phone Number must contain 10 numbers').max(999999999999,'Phone Number cannot exceed 12 numbers').required('Please provide the phone number').integer(),
      address : yup.string().max(150,'Name Should not exceed 150 Characters').required('Please provide the Firstname'),
      district : yup.string().required(),
      state : yup.string().required(),
      email : yup.string().email('Invalid email').required("Please provide the email Id"),
      password : yup.string().max(20,'Password Should not exceed 20 Characters').required('Please provide the Password').min(8,'Password must contain atleast 8 characters'),
      cpassword : yup.string().max(20,'Password Should not exceed 20 Characters').required('Please provide the Password').oneOf([yup.ref('password')],'Password must match').min(8,'Password must contain atleast 8 characters'),        
    }),
    onSubmit:values=>{
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", fileName);
      formData.append("fname",values.fname);
      formData.append("lname",values.lname);
      formData.append("phone",values.phone);
      formData.append("address",values.address);
      formData.append("district",values.district);
      formData.append("state",values.state);
      formData.append("email",values.email);
      formData.append("password",values.password);
      axios.post('http://localhost:3001/createUsers',formData).then((response)=>{
       // console.log(response);
        if(response.data.error_status==='fail')
        { 
          alert ("This email is already signed");
        }
        else if(response.data.error_status==='no_id')
        { 
          alert ("Please upload id proof");
        }
        else if(response.data.error_status==='wrong_format')
        { 
          alert ("Please upload id proof as image");
        }
        else{
         alert ("User Created");
         window.location.pathname = "/login";
        }
       });
    }
  })



  return (
    <div>
          <NavRegister/>
        <div className="note">
          <p>Register Now To Start Buying and Selling on Max-Bid</p>
        </div>
        <div className="form" >
        <form onSubmit={formik.handleSubmit}>

        <div className="input1">   
          <input type="text" name='fname' {...formik.getFieldProps("fname")}  id="fname" className="form__input" autoComplete="off" placeholder=" "/>
          {formik.touched.fname && formik.errors.fname ? <span style={{color:'red'}}>{formik.errors.fname}</span> : null}
          <label htmlFor="lname" className="form__label">First Name</label>
        </div>
        <div className="input1">   
          <input type="text" name='lname' {...formik.getFieldProps("lname")}  id="lname" className="form__input" autoComplete="off" placeholder=" "/>
          {formik.touched.lname && formik.errors.lname ? <span style={{color:'red'}}>{formik.errors.lname}</span> : null}
          <label htmlFor="lname" className="form__label">Last Name</label>
        </div>

        <div className="input1">
          <input type="text" name='phone'{...formik.getFieldProps("phone")}  id="phone" className="form__input" autoComplete="off" placeholder=" "/>
          {formik.touched.phone && formik.errors.phone ? <span style={{color:'red'}}>{formik.errors.phone}</span> : null}
          <label htmlFor="phone" className="form__label">Phone Number</label>
        </div>

        <div className="input1">
        <input type="text" name='address'{...formik.getFieldProps("address")} id="address" className="form__input" autoComplete="off" placeholder=" "/>
        {formik.touched.address && formik.errors.address ? <span style={{color:'red'}}>{formik.errors.address}</span> : null}
        <label htmlFor="address" className="form__label">Address</label>
        </div>
        
        <div className="input1">
<label className='idmsg'>UPLOAD ID PROOF</label>
        <input className='form-control form-control-lg file11' type="file" name="file" accept="image/*"onChange={(event) => {
              setFile(event.target.files[0]);
              setFileName(event.target.files[0].name);

            }} />
                      {formik.touched.phone && formik.errors.file ? <span style={{color:'red'}}>{formik.errors.file}</span> : null}

            </div>

        <div className="input1">
        <input type="text" name='district'{...formik.getFieldProps("district")} id="district" className="form__input" autoComplete="off" placeholder=" "/>
        {formik.touched.district && formik.errors.district ? <span style={{color:'red'}}>{formik.errors.district}</span> : null}
        <label htmlFor="district" className="form__label">District</label>
        </div>

        <div className="input1">
        <input type="text" name='state'{...formik.getFieldProps("state")} id="state" className="form__input" autoComplete="off" placeholder=" "/>
        {formik.touched.state && formik.errors.state ? <span style={{color:'red'}}>{formik.errors.state}</span> : null}
        <label htmlFor="state" className="form__label">State</label>
        </div>

        <div className="input1">
        <input type="text" name='email'{...formik.getFieldProps("email")} id="email" className="form__input" autoComplete="off" placeholder=" "/>
        {formik.touched.email && formik.errors.email ? <span style={{color:'red'}}>{formik.errors.email}</span> : null}
        <label htmlFor="email" className="form__label">Email</label>
        </div>

        <div className="input1">
        <input type="password"name='password' {...formik.getFieldProps("password")} id="password" className="form__input" autoComplete="off" placeholder=" "/>
        {formik.touched.password && formik.errors.password ? <span style={{color:'red'}}>{formik.errors.password}</span> : null}
        <label htmlFor="password" className="form__label">Password</label>
        </div>
        
        <div className="input1">
        <input type="password" name='cpassword'{...formik.getFieldProps("cpassword")} id="cpassword" className="form__input" autoComplete="off" placeholder=" "/>
        {formik.touched.cpassword && formik.errors.cpassword ? <span style={{color:'red'}}>{formik.errors.cpassword}</span> : null}
        <label htmlFor="cpassword" className="form__label">Confirm Password</label>
        </div>
        
        <div className="wrap">
          <button className="button" type='submit'>Submit</button>
        </div>
        </form>
      </div>
      </div>
  )
}

export default Register