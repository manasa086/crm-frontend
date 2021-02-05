import React,{useEffect,useState} from 'react';
import "./LeadsHome.css";
import {useHistory} from "react-router-dom"
import logo from "./logo.png"

function LeadsHome() {

    const [leadData,setLeadData]=useState([]);
    const [message,setMessage]=useState("");
    const [status,setStatus]=useState("");
    const [filterValue,setFilterValue]=useState("All");
    const [leadMessage,setLeadMessage]=useState("");
    const history=useHistory();
    const [noData,setNoData]=useState("");
    
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
    // useEffect(()=>{
    //     fetch("https://manasa-crm-backend.herokuapp.com/getLeadData")
    //     .then((res)=>res.json())
    //     .then((data)=>{
    //         setLeadData(data.message);
    //     })
    // },[])
    const logout=()=>{
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        history.push("/");
    }
    const changeStatus=(e)=>{
        setStatus(e.target.value);
    }
    const changeStatusSubmit=(user)=>{
        setMessage("")
        if(status=="--default--"){
            setMessage("Select Status to Update 😐")  
        }
        else{
            user.status=status.toString();
            // user.email=sessionStorage.getItem("email");
            user.token=sessionStorage.getItem("token");
            fetch("https://manasa-crm-backend.herokuapp.com/updateLeadData",{
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
    const filter=()=>{
        setMessage("");
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
            if(filterValue!="All")
            {
                let data1=data.message.filter((each)=>each.status==filterValue)
                if(data1.length>0)
                    setLeadData(data1);
                else
                {
                    setLeadData(data1);
                    setLeadMessage("NoData");
                }
            }
            else{
                setLeadData(data.message)
            }
        })
    }
    const navigateToHome=()=>{
        history.push("/AdminPage")
    }

    const navigateToLeads=()=>{
        history.push("/leadshome")
    }
    const navigateToCreation=()=>{
        history.push("/leads")
    }
    const navigateToContact=()=>{
        history.push("/contactshome")
    }
    const navigateToServiceRequest=()=>{
        history.push("/servicerequesthome")
    }
    const changeClassName=()=>{
        let x = document.getElementById("myTopnav");
        if (x.className === "topnav") {
            x.className += " responsive";
        } else {
            x.className = "topnav";
        }
    }
    const setFilter=(e)=>{
        setFilterValue(e.target.value);
    }
    if(leadData.length>0)
    {
        return (
            <div className="admin__page">
                <div className="topnav" id="myTopnav">
                <img src={logo} className="admin__logo"></img>
                <span className="admin__span" id="content1">CRM</span>
       {sessionStorage.getItem("role").toString()!=="Employee with access rights"?<a  className="active cursor" onClick={navigateToHome} >Home</a>:null}
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContact}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
        <a className="cursor button1" onClick={logout}>Logout</a>
        <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
        <i class="fa fa-bars"></i>
        </a>
        </div>
        <button className="lead__heading2" onClick={navigateToCreation}>➕ Create Lead</button>
        <h4 className="lead__heading"><span className="lead__head">Filter Leads By:</span>&nbsp;&nbsp;<select className="lead__filter" onChange={setFilter}>
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Confirmed">Confirmed</option></select>&nbsp;&nbsp;
            <button className="lead__filter_button" onClick={filter}>Filter</button></h4>
            <h4 className="lead__heading1">Filtered Leads Information</h4>
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
                  {sessionStorage.getItem("role").toString()!=="Employee with access rights"?<th scope="col">Select Status to Change</th>:null}
                  {sessionStorage.getItem("role").toString()!=="Employee with access rights"?<th scope="col">Change Status</th>:null}
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
                            {sessionStorage.getItem("role").toString()!=="Employee with access rights"?<td data-label="Select Status to Change"><select className="admin__changeStatus" onChange={changeStatus} >
                                <option value="--default--">--select--</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Lost">Lost</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Confirmed">Confirmed</option></select></td>:null}
                            
                                {sessionStorage.getItem("role").toString()!=="Employee with access rights"?<td data-label="Change Status"><button  className="admin__button"  onClick={()=>changeStatusSubmit(user)}>Change Status</button></td>:null}
                            </tr>
                            </tbody>)
                        })
                }
                
        </table>
        {message?<p className="admin__message">{message}</p>:null}
        
        </div>
        
        )
    }
    else if(leadMessage=="NoData")
    {
        return (
            <div className="admin__page">
                <div className="topnav" id="myTopnav">
                <img src={logo} className="admin__logo"></img>
                <span className="admin__span" id="content1">CRM</span>
                {sessionStorage.getItem("role").toString()!=="Employee with access rights"?<a  className="active cursor" onClick={navigateToHome} >Home</a>:null}
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContact}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest}>Service Requests</a>
        <a className="cursor button1" onClick={logout}>Logout</a>
        <a href="javascript:void(0);" className="icon" onClick={changeClassName}>
        <i class="fa fa-bars"></i>
        </a>
        </div>
        <button className="lead__heading2" onClick={navigateToCreation}>➕ Create Lead</button>
        <h4 className="lead__heading"><span className="lead__head">Filter Leads By:</span>&nbsp;&nbsp;<select className="lead__filter" onChange={setFilter}>
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Confirmed">Confirmed</option></select>&nbsp;&nbsp;
            <button className="lead__filter_button" onClick={filter}>Filter</button></h4>
        <h4 className="lead__heading">No Data Available</h4>
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
        <a  className="active cursor" onClick={navigateToHome} >Home</a>
        <a className="cursor" onClick={navigateToLeads} >Leads</a>
        <a className="cursor" onClick={navigateToContact}>Contact</a>
        <a className="cursor" onClick={navigateToServiceRequest} >Service Requests</a>
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

export default LeadsHome
