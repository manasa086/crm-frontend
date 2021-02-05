import React,{useState,useEffect} from 'react';
import "./LeadsHome.css";
import {useHistory} from "react-router-dom"
import logo from "./logo.png"

function EmployeeWithOutRightsContactsHome() {
    const [contactData,setContactData]=useState([]);
    const [noData,setNoData]=useState("");
    const [message,setMessage]=useState("");
    const [status,setStatus]=useState("");
    const history=useHistory();
    
    useEffect(()=>{
        let data={
            email:sessionStorage.getItem("email"),
            token:sessionStorage.getItem("token")
        }
        fetch("https://manasa-crm-backend.herokuapp.com/getContactData",{
                method:"POST",
                body:JSON.stringify(data),
                headers:{
                    "Content-Type":"application/json"
                }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setContactData(data.message);
            if(data.message.length==0)
            {
                setNoData("No Contacts Created")
            }
        })
    },[])


    
    const navigateToLeads=()=>{
        history.push("/employeeWithOutRights")
    }
  
    const navigateToContacts=()=>{
        history.push("/employeeWithOutRightscontactshome")
    }
    const navigateToServiceRequest=()=>{
        history.push("/employeeWithOutRightsServiceRequesthome")
    }
    const changeClassName=()=>{
        let x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }
    const logout=()=>{
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        history.push("/");
    }
    if(contactData.length>0)
    {
        return (
            <div className="admin__page">
                <div className="topnav" id="myTopnav">
                <img src={logo} className="admin__logo"></img>
                <span className="admin__span" id="content1">CRM</span>
     
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContacts}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
        <a className="cursor button1" onClick={logout}>Logout</a>
        <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
        <i class="fa fa-bars"></i>
        </a>
        </div>
    
        
            <h4 className="lead__heading1">Contact Information</h4>
        <table className="admin__table1">
                <thead>
                    <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Lead Name</th>
                    <th scope="col">Email ID</th>
                    <th scope="col">Account Name</th>
                    <th scope="col">Title</th>
                    
                    <th scope="col">Mobile</th>
                    </tr>
                    </thead>
                    {contactData.map((user,index)=>{
                        let email_index=user.email.indexOf("@");
                        return(<tbody key={index}>
                            <tr>
                            <td data-label="S.No" scope="row">{index+1}</td>
                            <td data-label="Lead Name">{user.name}</td>
                            <td data-label="Email ID"><span className="admin__gmail">{user.email.substring(0,email_index)}<br></br>{user.email.substring(email_index,user.email.length)}</span></td>
                            <td data-label="Account Name">{user.accountname}</td>
                            <td data-label="Title">{user.title}</td>
                            <td data-label="Mobile">{user.mobile}</td>
                            </tr>
                            </tbody>)
                        })
                }
                
        </table>
        {message?<p className="admin__message">{message}</p>:null}
        
        </div>
        
        )
    }
    else if(noData=="No Contacts Created")
    {
        return (
            <div className="admin__page">
                <div className="topnav" id="myTopnav">
                <img src={logo} className="admin__logo"></img>
                <span className="admin__span" id="content1">CRM</span>
       
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContacts}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
        <a className="cursor button1" onClick={logout}>Logout</a>
        <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
        <i class="fa fa-bars"></i>
        </a>
        </div>
        <h4 className="lead__heading">No Contacts Created</h4>
        </div>
        )
    }
    else{
        return (<h1 className="blink">Customer Relation Management</h1>)
    }
}

export default EmployeeWithOutRightsContactsHome
