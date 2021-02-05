import React,{useEffect,useState} from 'react';
import "./AdminPage.css";
import {useHistory} from "react-router-dom"
import logo from "./logo.png"
function AdminPage() {

    const [userData,setUserData]=useState([]);
    const [status,setStatus]=useState("--default--")
    const [message,setMessage]=useState("");
    const [leadCount,setLeadCount]=useState(0);
    const [contactCount,setContactCount]=useState(0);
    const [serviceRequestCount,setServiceRequestCount]=useState(0);
    const history=useHistory();

    useEffect(()=>{
        let data={
            email:sessionStorage.getItem("email"),
            token:sessionStorage.getItem("token")
        }
        fetch("https://manasa-crm-backend.herokuapp.com/getUserData",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setUserData(data.message.filter((each)=>each.firstname!="admin"));
        })
        fetch("https://manasa-crm-backend.herokuapp.com/getLeadData",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setLeadCount(data.message.length);
        })
        fetch("https://manasa-crm-backend.herokuapp.com/getContactData",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setContactCount(data.message.length);
        })
        fetch("https://manasa-crm-backend.herokuapp.com/getServiceRequestData",{
            method:"POST",
            body:JSON.stringify(data),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((data)=>{
            setServiceRequestCount(data.message.length);
        })
    },[])

    const navigateToLeads=()=>{
        history.push("/leadshome")
    }

    const navigateToHome=()=>{
        history.push("/AdminPage");
    }
    const navigateToContact=()=>{
        history.push("/contactshome")
    }
    const navigateToServiceRequest=()=>{
        history.push("/servicerequesthome")
    }
    const logout=()=>{
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        history.push("/");
    }
    const statusChange=(e)=>{
        setStatus(e.target.value);
        // console.log(status)
    }
    const changeClassName=()=>{
        let x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }

    const changeStatusSubmit=(user)=>{
        
        // user.email=sessionStorage.getItem("email").toString();
        setMessage("");
        if(status=="--default--"){
            setMessage("Select Status to Update 😐")  
        }
        else{
            user.role=status.toString();
            user.token=sessionStorage.getItem("token").toString();
            setMessage("")
            fetch("https://manasa-crm-backend.herokuapp.com/changeStatus",{
                method:"PUT",
                body:JSON.stringify(user),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            .then((res)=>res.json())
            .then((data)=>{
                setMessage(data.message);
            })
        }
        
       

    }
    if(userData.length>0)
    {
    return (
        <div className="admin__page">
            <div className="topnav" id="myTopnav">
            <img src={logo} className="admin__logo"></img>
            <span className="admin__span" id="content1">CRM</span>
    <a  className="active cursor" onClick={navigateToHome} >Home</a>
    <a className="cursor" onClick={navigateToLeads} >Leads</a>
    <a className="cursor" onClick={navigateToContact}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
    <a className="cursor button1" onClick={logout}>Logout</a>
    <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
    <i class="fa fa-bars"></i>
    </a>
    </div>
       {sessionStorage.getItem("role")=="admin"?<h4>Welcome Admin</h4>:null}
       {sessionStorage.getItem("role")=="Manager"?<h4>Welcome Manager</h4>:null}
        <h4 className="admin__heading">Total Count of Leads,Contacts, Service Requests Created</h4>
        <table className="admin__table">
            <thead>
            <th>Count of Leads</th>
            <th>Count of Contacts</th>
            <th>Count of Service Requests</th>
            </thead>
            <tbody>
                <td>{leadCount}</td>
                <td>{contactCount}</td>
                <td>{serviceRequestCount}</td>
            </tbody>
        </table>
        {sessionStorage.getItem("role")=="admin"?<><h4 className="admin__heading">Change the Status of Employees</h4>
        <table className="admin__table1">
            <thead>
                <tr>
                <th scope="col">S.No</th>
                <th scope="col">Employee Name</th>
                <th scope="col"> Employee Email ID</th>
                <th scope="col">Current Status</th>
                <th scope="col">Select Status to Change</th>
                <th scope="col">Change Status</th>
                </tr>
            </thead>
            {userData.map((user,index)=>{
                let email_index=user.email.indexOf("@");
            
                return (<tbody key={index}>
                    <tr>
                    <td data-label="S.No" scope="row">{index+1}</td>
                    <td data-label="Employee Name">{user.firstname}<br></br>{user.lastname}</td>
                    <td data-label="Employee Email ID" className="admin__gmail">{user.email.substring(0,email_index)}<br></br>{user.email.substring(email_index,user.email.length)}</td>
                    <td data-label="Current Status">{user.role}</td>
                    <td data-label="Select Status to Change"><select className="admin__changeStatus" onChange={statusChange}>
                        <option value="--default--">--select--</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee with access rights">Employee with access rights</option>
                        <option value="Employee with out access rights">Employee with out access rights</option></select></td>
                    <td data-label="Change Status"><button  className="admin__button"  onClick={()=>changeStatusSubmit(user)}>Change Status</button></td>
                    </tr>
                    
                </tbody>)
            })}
        </table></>:null}
       {message?<p className="admin__message">{message}</p>:null}
        
        </div>
    )
    }
    else{
       return (<h1 className="blink">Customer Relation Management</h1>)
    }

}

export default AdminPage
