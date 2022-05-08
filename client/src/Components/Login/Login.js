import * as axios from 'axios';
import {useFormik} from 'formik';
import * as yup from 'yup';

import './Login.css';
import NavigationLogin from '../NavigationBar/Navigation_Login/NavigationLogin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  // const notify = () => toast("Welcome to MAX-Bid");
  const formik = useFormik({
    initialValues:{
      email:'',
      password:'',
    },
    validationSchema : yup.object({ 
      email : yup.string().email('Invalid email').required("Please provide the email Id"),
      password : yup.string().max(20,'Password Should not exceed 20 Characters').required('Please provide the Password').min(8,'Password must contain atleast 8 characters'),
    }),
    onSubmit:values=>{
    //  alert(values.password);
      axios.post('http://localhost:3001/login',{
     
          email:values.email,
          password:values.password,
          
         }).then((response)=>{
           //console.log(response);
           localStorage.clear();
           if(response.data.status==="admin")
           {
            
            localStorage.setItem('token', response.data.user);
            localStorage.setItem('uid', response.data.id);
            toast("Welcome "+response.data.fname+ " to MAX-Bid")


            setTimeout( function ( ) {  window.location.pathname = "/AdminHome"; }, 1000 );  ;
           }
           else if(response.data.login_status=="success")
           {
            
             localStorage.setItem('status', response.data.status);
             

             if(localStorage.getItem('status')=='un_approved')
             {
              window.location.pathname = "/Home-Guest";
             }
             else if(response.data.user){
                
                localStorage.setItem('token', response.data.user);
                localStorage.setItem('email', values.email);
                localStorage.setItem('uid', response.data.id);
                toast("Welcome "+response.data.fname+ " to MAX-Bid")
                setTimeout( function ( ) {  window.location.pathname = "/Home"; }, 1000 );  ;
             }

           }
           else if(response.data.login_status="fail")
           {
            //alert(response.data.login_status);
             alert("Username/Password is incorrect");
           }
       });
    }
  })



  return (
    <div >
      <NavigationLogin/>
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
        <div className="note">
          <p>Login now on Max-Bid</p>
        </div>
        <div className="form1" >
        <form onSubmit={formik.handleSubmit}>

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
        
        <div className="wrap">
          <button className="button" type='submit'>Login</button>
        </div>
        </form>
      </div>
      </div>
  )
}

export default Login