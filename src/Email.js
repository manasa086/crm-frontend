import React from 'react';
import "./Email.css";
import {useHistory} from "react-router-dom";

function Email() {

    const history=useHistory();

    const login=()=>{
        history.push("/login")
    }

    return (
        <>
        <h1 className="heading">CRM Application</h1>
        <div className="email__border">

            <a href="#" className="email__anchor" onClick={login}>Click this link to Login 😃 </a>
        </div>
        </>
    )
}

export default Email
