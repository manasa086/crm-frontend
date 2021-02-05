const express = require('express');
const path = require('path');
const cors=require('cors');
const bcrypt=require('bcryptjs');
const Razorpay = require('razorpay')
var mongodb=require("mongodb");
var MongoClient=mongodb.MongoClient;
var url=process.env.url;
const app = express();
const PORT = process.env.PORT || 5000; 
var dbname="crmdata";
const nodemailer=require("nodemailer");
const jwt = require("jsonwebtoken");
const client_URL=process.env.client_URL;
const forgot_client_URL=process.env.forgot_client_URL;
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const gmail_user=process.env.gmail_user;
const clientID=process.env.clientID;
const clientSecret=process.env.clientSecret;
const refreshToken=process.env.refreshToken;
const oauth2Client = new OAuth2(
    clientID,
    clientSecret,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );
  
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });
  const accessToken = oauth2Client.getAccessToken()
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: "OAuth2",
      user: gmail_user,
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken
    }
  });


  

var authenticate = function(req, res, next) {
    if (req.body.token) {
        jwt.verify(req.body.token, process.env.JWT_SECRET, function(err, decoded) {
            if (decoded) {
                next();
            } else {
                res.json({
                    message: "Not Authenticated"
                })
            }
        });
        //next();
    } else {
        res.json({
            message: "Token is not valid"
        });
    }
};

app.post("/signup",(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err)
            {
                console.log("Error while connnecting to MongoDB Atlas",err);
            }
            let db=client.db(dbname);
            let token=jwt.sign({email:req.body.email},process.env.EMAIL_SECRET);
            // console.log(req.body.email)
            let mail_to_send=req.body.email;
            let url=`${process.env.backendurl}/signUpConfirm/${token}`;
            let info=await transporter.sendMail({
                from:gmail_user,
                to:mail_to_send,
                subject:"Customer Relation Management",
                html:`<a href=${url}>Please Click this link to activate account`
            })
            req.body.role="Employee with out access rights";
            req.body.email_verify=false;
            let salt=await bcrypt.genSalt(10);
            let pass=await bcrypt.hash(req.body.password,salt);
            req.body.password=pass;
            let insertData=await db.collection("userdata").insertOne(req.body);
            // console.log(req.body)
            client.close();
            res.json({
                message:"Email Sent to Your Email Account. Please Verify"
            })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Email Already Exists.Kindly Provide another Email"
            })
        }
    })
})
app.get("/signUpConfirm/:token",(req,res)=>{
    
    MongoClient.connect(url,async function(err,client)
    {
        if(err)
            console.log("Error in connecting to Mongo DB Atlas",err);
        var db=client.db(dbname);
        let email_verify=jwt.verify(req.params.token,process.env.EMAIL_SECRET,async function(err,decoded)
        {
            if(decoded)
            {
                        
                        db.collection("userdata").findOneAndUpdate({email:decoded.email},{$set:{email_verify:true}},
                        function(err,data)
                        {
                            if(err)
                            {
                                console.log("Error while inserting into database");
                            }
                            client.close();
                            res.redirect(client_URL);
                        })
                    
            }
            else
            {
                client.close();
                res.json({
                    message:"Token is not valid"
                })
            }
        })
        
    })
})
app.post("/login",(req,res)=>{
    MongoClient.connect(url,function(err,client)
    {
        if(err)
            console.log("Error while connecting to MongoDB Atlas",err);
        var db=client.db(dbname);
        
        
       if(req.body.email!=="admin")
       {
        var loginData=db.collection("userdata").findOne({email:req.body.email});
        loginData.then(async function(user)
        {
           
            if(user)
            {
                let email_verify=user.email_verify;
                // console.log(email_verify);
                if(email_verify)
                {
                    try
                    {
                        let token=jwt.sign({email:req.body.email},process.env.JWT_SECRET);
                        // console.log(req.body.password);
                        let result = await bcrypt.compare(req.body.password, user.password);
                        // console.log(result);
                        if(result)
                        {
                                client.close();
                                res.json({
                                    message:"Success",
                                    token,
                                    role:user.role
                                })
                        }
                        else
                        {
                            client.close();
                            res.json({message:"User Name or Password is incorrect"});
                        }
                    }
                    catch(error)
                    {
                        client.close();
                        res.json({message:error})
                    }
                }
                else
                {
                    client.close();
                    res.json({message:"Email is not verified,Kindly verify your email to login"})
                }

            }
            else
            {
                client.close();
                res.json({message:"Provided Email is not registered"});
            }
        })
        }
        else{
            var loginData=db.collection("userdata").findOne({firstname:req.body.email});
            loginData.then(async function(user)
        {
           
            if(user)
            {
                let email_verify=user.email_verify;
                // console.log(email_verify);
                if(email_verify)
                {
                    try
                    {
                        let token=jwt.sign({firstname:req.body.email},process.env.JWT_SECRET);
                        // console.log(req.body.password);
                        let result = await bcrypt.compare(req.body.password, user.password);
                        // console.log(result);
                        if(result)
                        {
                                client.close();
                                res.json({
                                    message:"Success",
                                    token,
                                    role:user.role
                                })
                        }
                        else
                        {
                            client.close();
                            res.json({message:"User Name or Password is incorrect"});
                        }
                    }
                    catch(error)
                    {
                        client.close();
                        res.json({message:error})
                    }
                }
                else
                {
                    client.close();
                    res.json({message:"Email is not verified,Kindly verify your email to login"})
                }

            }
            else
            {
                client.close();
                res.json({message:"Provided Email is not registered"});
            }
        })
        }
    })
})

app.post("/forgotPasswordUser",async function(req,res){
    let token = jwt.sign({ email: req.body.email }, process.env.EMAIL_SECRET);
    let mail_to_send=req.body.email;
    let url=`${process.env.backendurl}/changePasswordConfirm/${token}`;
    let info=await transporter.sendMail({
        from:gmail_user,
        to:mail_to_send,
        subject:"Customer Relation Management--Forgot Password",
        html:`<b>Forgot Password</b><br><a href=${url}>Please Click this link to change the password</a>`
    })
    res.json({message:"Email sent to Your Account. Kindly, Verify"});
                        
})
app.get("/changePasswordConfirm/:token",(req,res)=>{
    let email_verify=jwt.verify(req.params.token,process.env.EMAIL_SECRET,async function(err,decoded)
        {
            if(decoded)
            {
                res.redirect(forgot_client_URL);    
            }
            else
            {
                res.json({
                    message:"Token is not valid"
                })
            }
        })
})
app.put("/changePassword",(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        if(err)
            console.log("Error while connecting to MongoDB Atlas",err);
        var db=client.db(dbname);
        let salt=await bcrypt.genSalt(10);
        let hash=await bcrypt.hash(req.body.password,salt);
        req.body.password=hash;
        let updateData=db.collection("userdata").findOneAndUpdate({email:req.body.email},{$set:{password:req.body.password}},
            function(err,data){
                if(err)
                {
                    client.close();
                    res.json({message:err})
                }
                else
                {
                    client.close();
                    res.json({message:"Data Updated Successfully"})
                }
            })
    })
})

app.post("/getUserData",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err)
                console.log("Error while connecting to MongoDB Atlas",err);
            let db=client.db(dbname);
            let getData=await db.collection("userdata").find({}).toArray();
            client.close();
            res.json({
                message:getData
            })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Error while fetching data from the database"
            })
        }
    })
})
app.put("/changeStatus",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err)
            {
                console.log("Error while connecting to Mongo DB Atlas",err);
            }
            let db=client.db(dbname);
            let updateData=await db.collection("userdata").findOneAndUpdate({email:req.body.email},{$set:{role:req.body.role}});
            client.close();
            res.json({
                message:"Status Updated SuccessFully 😃"  
            })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while updating the status. Kindly Try Again 😞"  

            })
        }

    })
})
app.post("/saveLeadDetails",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err){
                console.log("Error while connecting to MongoDB Atlas",err);
            }
            let db=client.db(dbname);
            req.body.status="New";
            
            let findData=await db.collection("userdata").find({role:{$in:["admin","Manager"]}}).toArray();
            let sendMails=[];
            findData.map((each,index)=>{
                sendMails.push(each.email);
            })
            let info=await transporter.sendMail({
                from:gmail_user,
                to:[...sendMails],
                subject:"Customer Relation Management",
                html:`<b>New Lead Details Added to the Customer Relation Management Application</b>`
            })
            delete req.body["token"];
            let insertData=await db.collection("leaddata").insertOne(req.body);
            
            client.close();
            res.json({
                message:"Lead Details Saved SuccessFully 😃"  
            })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Lead Data Already Exists. Kindly Provide Another Lead Information😞"    
            })
        }

    })
})
app.post("/getLeadData",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err)
                console.log("Error while connecting to MongoDB Atlas",err);
            let db=client.db(dbname);
            let getLeadData=await db.collection("leaddata").find({}).toArray();
            // console.log(getLeadData)
            client.close();
            res.json({
                message:getLeadData
            })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while fetching the data"
            })
        }
    })
})
app.put("/updateLeadData",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client)
    {
        if(err)
        {
            console.log("Error while connecting to MongoDB Atlas",err);
        }
        try{
            let db=client.db(dbname);
            let updateData=await db.collection("leaddata").findOneAndUpdate({name:req.body.name,email:req.body.email,mobile:req.body.mobile,title:req.body.title,company:req.body.company},{$set:{status:req.body.status}});
            client.close();
            res.json({
                message:"Status Changed SuccessFully 😃"  
             })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Error while Updating the Status. Kindly, try again 😞"  
            })
        }
    })
})
app.post("/saveContactDetails",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err){
                console.log("Error while connecting to MongoDB Atlas",err);
            }
            let db=client.db(dbname);
            let findData=await db.collection("userdata").find({role:{$in:["admin","Manager"]}}).toArray();
            let sendMails=[];
            findData.map((each,index)=>{
                sendMails.push(each.email);
            })
            let info=await transporter.sendMail({
                from:gmail_user,
                to:[...sendMails],
                subject:"Customer Relation Management",
                html:`<b>New Contact Details Added to the Customer Relation Management Application</b>`
            });
            delete req.body["token"];
            let insertData=await db.collection("contactdata").insertOne(req.body);
            client.close();
            res.json({
                message:"Contact Details Saved SuccessFully 😃"  
            })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Contact Data Already Exists. Kindly Provide Another Contact Information😞"    
            })
        }

    })
})
app.post("/getContactData",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err)
                console.log("Error while connecting to MongoDB Atlas",err);
            let db=client.db(dbname);
            let getContactData=await db.collection("contactdata").find({}).toArray();
            // console.log(getContactData)
            client.close();
            res.json({
                message:getContactData
            })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while fetching the data"
            })
        }
    })
});
app.post("/saveServiceRequestDetails",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err){
                console.log("Error while connecting to MongoDB Atlas",err);
            }
            let db=client.db(dbname);
            req.body.status="Created";
            let findData=await db.collection("userdata").find({role:{$in:["admin","Manager"]}}).toArray();
            let sendMails=[];
            findData.map((each,index)=>{
                sendMails.push(each.email);
            })
            let info=await transporter.sendMail({
                from:gmail_user,
                to:[...sendMails],
                subject:"Customer Relation Management",
                html:`<b>New Service Request Details Added to the Customer Relation Management Application</b>`
            });
            delete req.body["token"];
            let insertData=await db.collection("servicerequest").insertOne(req.body);
            client.close();
            res.json({
                message:"Service Request Details Saved SuccessFully 😃"  
            })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Service Request Already Exists. Kindly Provide Another Service Request Information😞"    
            })
        }

    })
})
app.post("/getServiceRequestData",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client){
        try{
            if(err)
                console.log("Error while connecting to MongoDB Atlas",err);
            let db=client.db(dbname);
            let getServiceRequestData=await db.collection("servicerequest").find({}).toArray();
            // console.log(getLeadData)
            client.close();
            res.json({
                message:getServiceRequestData
            })
        }
        catch(error){
            client.close();
            res.json({
                message:"Error while fetching the data"
            })
        }
    })
})
app.put("/updateServiceRequestData",authenticate,(req,res)=>{
    MongoClient.connect(url,async function(err,client)
    {
        if(err)
        {
            console.log("Error while connecting to MongoDB Atlas",err);
        }
        try{
            let db=client.db(dbname);
            let updateData=await db.collection("servicerequest").findOneAndUpdate({requestname:req.body.requestname,requestdescription:req.body.requestdescription,requestermobile:req.body.requestermobile,requestername:req.body.requestername,requesteremail:req.body.requesteremail},{$set:{status:req.body.status}});
            client.close();
            res.json({
                message:"Status Changed SuccessFully 😃"  
             })
        }
        catch(error)
        {
            client.close();
            res.json({
                message:"Error while Updating the Status. Kindly, try again 😞"  
            })
        }
    })
})
app.listen(PORT, console.log(`Server is starting at ${PORT}`));