import React,{useEffect,useState} from 'react';
import "./LeadsHome.css";
import {useHistory} from "react-router-dom"
import logo from "./logo.png"

function EmployeeWithOutRights() {
    const [leadData,setLeadData]=useState([]);

    const [noData,setNoData]=useState("");
   
    const history=useHistory();
    
    useEffect(()=>{
        let data={
            email:sessionStorage.getItem("email"),
            token:sessionStorage.getItem("token")
        }
        fetch("https://manasa-crm-backend.herokuapp.com/getLeadData",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setLeadData(data.message);
            if(data.message.length==0)
            {
                setNoData("No Lead Created")
            }
        })
    },[])

   
  

    const navigateToLeads=()=>{
        history.push("/employeeWithOutRights")
    }
  
    const navigateToContact=()=>{
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
    if(leadData.length>0)
    {
        return (
            <div className="admin__page">
                <div className="topnav" id="myTopnav">
                <img src={logo} className="admin__logo"></img>
                <span className="admin__span" id="content1">CRM</span>
     
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContact}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
        <a className="cursor button1" onClick={logout}>Logout</a>
        <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
        <i class="fa fa-bars"></i>
        </a>
        </div>
        <p></p>
        <h4 className="lead__heading1">Leads Information</h4>
        <table className="admin__table1">
                <thead>
                    <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Lead Name</th>
                    <th scope="col">Email ID</th>
                    <th scope="col">Company</th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Mobile</th>
                    </tr>
                    </thead>
                    {leadData.map((user,index)=>{
                        let email_index=user.email.indexOf("@");
                        return(<tbody key={index}>
                            <tr>
                            <td data-label="S.No" scope="row">{index+1}</td>
                            <td data-label="Lead Name">{user.name}</td>
                            <td data-label="Email ID"><span className="admin__gmail">{user.email.substring(0,email_index)}<br></br>{user.email.substring(email_index,user.email.length)}</span></td>
                            <td data-label="Company">{user.company}</td>
                            <td data-label="Title">{user.title}</td>
                            <td data-label="Status">{user.status}</td>
                            <td data-label="Mobile">{user.mobile}</td>
                            </tr>
                            </tbody>)
                        })
                }
                
        </table>
     
        
        </div>
        
        )
    }
    
    else if(noData=="No Lead Created")
    {
        return (
            <div className="admin__page">
                <div className="topnav" id="myTopnav">
                <img src={logo} className="admin__logo"></img>
                <span className="admin__span" id="content1">CRM</span>
       
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContact}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
        <a className="cursor button1" onClick={logout}>Logout</a>
        <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
        <i class="fa fa-bars"></i>
        </a>
        </div>
        <h4 className="lead__heading">No Lead Data Available</h4>
        </div>
        )
    }
    else{
        return (<h1 className="blink">Customer Relation Management</h1>)
    }
}

export default EmployeeWithOutRights;
