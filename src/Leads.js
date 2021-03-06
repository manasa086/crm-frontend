import React,{useState} from 'react';
import {useHistory} from "react-router-dom";
import "./Leads.css";

function Leads() {

    const [input,setInput]=useState({name:"",email:"",mobile:"",title:"",company:""})
    const [errors,setErrors]=useState();
    const [message,setMessage]=useState("");
    const history=useHistory();

    const changeInput=(e)=>{
        setInput({
            ...input,
            [e.target.name]:e.target.value
        })
    }
    const navigateBack=()=>{
        history.push("/leadshome")
    }
    const handleValidation=()=>{

        let handle=true;
        let localerrors={};
        if(input.name=="")
        {
            localerrors["name"]="Name Cannot be Empty"
            handle=false;
        }
        if(input.email=="")
        {
           localerrors["email"]="Email Cannot be Empty"
            handle=false;
        }
        if(input.company=="")
        {
            localerrors["company"]="Company Cannot be Empty";
            handle=false;
        }
        if(input.title=="")
        {
            localerrors["title"]="Title Cannot be Empty"
            handle=false;
        }
        if(input.mobile=="")
        {
            localerrors["mobile"]="Mobile Cannot be Empty"
            handle=false;
        }
        setErrors({localerrors})
        return handle;
    }

    const saveLead=()=>{
        setMessage("");
        if(handleValidation()){
            
            input.token=sessionStorage.getItem("token");
            fetch("https://manasa-crm-backend.herokuapp.com/saveLeadDetails",{
                method:"POST",
                body:JSON.stringify(input),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            .then((res)=>res.json())
            .then((data)=>{
                setMessage(data.message);
                setInput({name:"",email:"",mobile:"",title:"",company:""})
            })
        }
        else{
            setMessage("Values cannot be Empty. All fields are mandatory")
        }
    }

    return (
        <div className="lead__page">
            <h2 className="heading">Lead Creation Form</h2>
            <div className="lead__border">

                <label className="lead__label">Full Name:</label>
                <input type="text" className="input" name="name" value={input.name} onChange={changeInput} placeholder="Full Name"></input>
                <br></br> <span  className="lead__error" style={{color: "red"}}>{errors?.localerrors?.name}</span><br></br>
                <label className="lead__label">Email:</label>
                <input type="email" className="input" name="email" value={input.email} onChange={changeInput} placeholder="Email"></input>
                <br></br> <span  className="lead__error" style={{color: "red"}}>{errors?.localerrors?.email}</span><br></br>
                <label className="lead__label">Company:</label>
                <input type="text" className="input" name="company" value={input.company} onChange={changeInput} placeholder="Company"></input>
                <br></br> <span  className="lead__error" style={{color: "red"}}>{errors?.localerrors?.company}</span><br></br>
                <label className="lead__label">Title:</label>
                <input type="text" className="input" name="title" value={input.title} onChange={changeInput} placeholder="Title"></input>
                <br></br> <span  className="lead__error" style={{color: "red"}}>{errors?.localerrors?.title}</span><br></br>
                <label className="lead__label">Mobile:</label>
                <input type="text" className="input" name="mobile" value={input.mobile} onChange={changeInput} placeholder="Mobile"></input>
                <br></br> <span  className="lead__error" style={{color: "red"}}>{errors?.localerrors?.mobile}</span><br></br>
                <button className="lead__button" onClick={saveLead}>Save Lead</button>
                <p className="lead__message">{message}</p>
                {message?<a href="#" className="lead__anchor" onClick={navigateBack}>Click this link to navigate back</a>:null}
            </div>
        </div>
    )
}

export default Leads
