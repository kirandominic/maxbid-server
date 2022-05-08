import { light } from '@mui/material/styles/createPalette'
import { useState,useEffect } from 'react'

import React, { Component } from 'react'
import "./adminhome.css"
import {SidebarData} from './Sidebar'
import NavigationAdmin from '../NavigationBar/Navadmin/NavAdmin'
import Axios from 'axios';

function AdminHome() {
  const [userCount, setUserCount] = useState('');
  const [adcount, setAdcount] = useState('');
  const [activeAdCount, setactiveAdCount] = useState('');

  const [reportcount, setReportcount] = useState('');
  const [uncheckedreportcount, setuncheckedreportcount] = useState('');



  useEffect(()=>{ 
    const token = localStorage.getItem('token')
    console.log(token);
    if(!token){
      localStorage.removeItem('token');
      window.location.pathname = "/login";}
      
      Axios.get("http://localhost:3001/getusercount").then((response) => {
        // setlistOfProducts(response.data);
        //console.log(response.data);
        setUserCount(response.data.usercount);
    });
    Axios.get("http://localhost:3001/getadcount").then((response) => {
      // setlistOfProducts(response.data);
      //console.log(response.data);
      setAdcount(response.data.adCount);
  });
  Axios.get("http://localhost:3001/getactiveadcount").then((response) => {
      // setlistOfProducts(response.data);
      //console.log(response.data);
      setactiveAdCount(response.data.activeAdCount);
  });
  Axios.get("http://localhost:3001/reportcount").then((response) => {
      // setlistOfProducts(response.data);
      console.log(response.data);
      setReportcount(response.data.reportcount);
  });
  Axios.get("http://localhost:3001/uncheckedreportcount").then((response) => {
      // setlistOfProducts(response.data);
      console.log(response.data);
      setuncheckedreportcount(response.data.uncheckedreportcount);
  });
    
    },[])
  return (
    <div>
    <NavigationAdmin/>
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
<div className='dashboard'>
      {/* <div className='users'></div> */}
<div class="top">
  <div class="components" id="c1">
    <p>Active Users</p>
    <div class="nb">
      <span>{userCount}</span>
      <p></p>
    </div>
    
  </div>
</div>
<div class="top">
  <div class="components" id="c1">
    <p>Total Advertisements</p>
    <div class="nb">
      <span>{adcount}</span>
    </div>
    
  </div>
</div>
<div class="top">
  <div class="components" id="c1">
    <p>Active Advertisements</p>
    <div class="nb">
      <span>{activeAdCount}</span>
    </div>
    
  </div>
</div>
<div class="top">
  <div class="components" id="c1">
    <p>Reported Advertisements</p>
    <div class="nb">
      <span>{reportcount}</span>
    </div>
    <p>Unchecked</p>
    <div class="nb">
      <span>{uncheckedreportcount}</span>
    </div>
    
    
  </div>
</div>
</div>
</div>
  )
}



export default AdminHome