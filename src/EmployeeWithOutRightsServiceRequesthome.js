import React,{useEffect,useState} from 'react';
import "./ServiceRequest.css";
import {useHistory} from "react-router-dom"
import logo from "./logo.png"

function EmployeeWithOutRightsServiceRequesthome() {
    const [serviceRequest,setserviceRequest]=useState([]);
    const [message,setMessage]=useState("");
    const [status,setStatus]=useState("");
    const [filterValue,setFilterValue]=useState("All");
    const [serviceRequestMessage,setserviceRequestMessage]=useState("");
    const history=useHistory();
    const [noData,setNoData]=useState("");
    
    useEffect(()=>{
        let data={
            email:sessionStorage.getItem("email"),
            token:sessionStorage.getItem("token")
        }
        fetch("https://manasa-crm-backend.herokuapp.com/getServiceRequestData",{
            method:"POST",
                body:JSON.stringify(data),
                headers:{
                    "Content-Type":"application/json"
                }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setserviceRequest(data.message);
            if(data.message.length==0)
            {
                setNoData("No Contacts Created")
            }
        })
    },[])
    
    const logout=()=>{
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        history.push("/");
    } 
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
 
    if(serviceRequest.length>0)
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
      
            <h4 className="lead__heading1">Service  Request Information</h4>
        <table className="admin__table3">
                <thead>
                    <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Request Name</th>
                    <th scope="col" >Request Description</th>
                    <th scope="col" >Requester Name</th>
                    <th scope="col" >Requester Email</th>
                    <th scope="col">Status</th>
                    <th scope="col">Mobile</th>
                 
                    </tr>
                    </thead>
                    {serviceRequest.map((user,index)=>{
                        let email_index=user.requesteremail.indexOf("@");
                        return(<tbody key={index}>
                            <tr>
                            <td data-label="S.No" scope="row">{index+1}</td>
                            <td data-label="Request Name">{user.requestname}</td>
                            <td data-label="Request Description">{user.requestdescription}</td>
                            <td data-label="Requester Name">{user.requestername}</td>
                            <td data-label="Requester Email"><span className="admin__gmail">{user.requesteremail.substring(0,email_index)}<br></br>{user.requesteremail.substring(email_index,user.requesteremail.length)}</span></td>
                            <td data-label="Status">{user.status}</td>
                            <td data-label="Requester Mobile">{user.requestermobile}</td>
                            </tr>
                            </tbody>)
                        })
                }
                
        </table>  
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
        <h4 className="lead__heading">No Service Request Created</h4>
        </div>
        )
    }
    else{
        return (<h1 className="blink">Customer Relation Management</h1>)
    }
}

export default EmployeeWithOutRightsServiceRequesthome
