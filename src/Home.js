import React,{useEffect,useState} from 'react';
import "./Home.css";
import {useHistory} from "react-router-dom"
import logo from "./logo.png"
import crm from "./crm.jpg"

function Home() {

    

    const history=useHistory();

    const login=()=>{
        // document.body.style.backgroundImage="none";
        history.push("/login")
    }
    const signUp=()=>{
      history.push("/signup")
    }
   
    return (
        <div className="outside__container">
          <img src={crm} className="home__image"></img>
        <nav className="navbar" id="top">
    <div className="inner">
    <img src={logo} className="home__logo"></img>
      CRM Application
      <button className="inner1" onClick={login}>Login</button>
    </div>
    <div className="content__text">
           
      <h1 className="heading">Customer Relation Management</h1>
      <p className="sub-title"></p>
      <p><button className="button" onClick={signUp}>Sign Up</button></p>
      
      </div>
  </nav>

  
  </div>
    )
    
}

export default Home
