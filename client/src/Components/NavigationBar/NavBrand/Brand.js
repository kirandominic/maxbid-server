import React, { Component } from 'react'
import { Navbar } from 'react-bootstrap';
import logo from '../../../Images/logo.png';
import './brand.css';
export default class Brand extends Component {

  render() {
    return (
        <div >
        <Navbar bg="light" fixed="top">
        <Navbar.Brand href="#home">
        <img
          alt=""
          src={logo}
          width="50"
          height="50"
         
        />{' '}
        MAX BID
      </Navbar.Brand>
    
    
        </Navbar>
        </div>
    )
  }
}
