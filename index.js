require("dotenv").config()

const express = require ("express")
const app = express()
const mongoose = require('mongoose')
const UserModel = require("./models/users")
const BidModel = require("./models/bids")
const RateModel = require("./models/advertisementRate")
const ReportModel = require("./models/reports")
const cron = require('node-cron');

const ProductModel = require("./models/Product")
const PaymentModel = require("./models/Payment")


mongoose
 .connect(
     process.env.MONGODB_CONNECTION_STRING,
         {
           useNewUrlParser: true,
           useUnifiedTopology: true,
         }
 )
 .then(() => console.log("MongoDB has been connected"))
 .catch((err) => console.log(err));


const cors =require("cors")
const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer');
const { google } = require('googleapis');




 

// mongoose.connect("mongodb+srv://kirandom:Kdmash123@cluster0.553jm.mongodb.net/maxbid?retryWrites=true&w=majority")
const fileUpload = require('express-fileupload');
app.use(express.json());

app.use(express.json())
app.use(cors())
app.use(express.static("files"));
app.use(fileUpload());
app.use('/Images/Products', express.static('Images/Products'));
app.use('/Images/UserDocuments', express.static('Images/UserDocuments'));
cron.schedule('* * * * * ', async function () {

    let date1 = new Date();;
    console.log("minute");
    
    const listOfProducts1 = await ProductModel.find({ date: {$not: {
        $gt: Date(date1)
    }}});
    listOfProducts1.forEach(async element1 => {

        //console.log(element1.pname);
           
               if(element1.expired === "no")
               { 
                  // console.log("inside loop")
                   
                const maxBidProduct = await BidModel.find({pid:(element1._id)}).sort({bid: -1,date : -1}).limit(1);
                    if(!maxBidProduct){
                        console.log("nobids found");
                        ProductModel.updateOne({_id:element1._id},
                                {winner:"noBids"}, function (err) {
                                if (err){
                                    console.log(err)
                    
                                }
                                else{
                                    console.log("updated winner none");
                                }
                            });
                    
                    }
                    else{
                    maxBidProduct.forEach(element2=>{
                        // console.log(element2.uid);
                        // console.log(element2.bid);
                        // console.log(element2.date);


                        ProductModel.updateOne({_id:element1._id},
                            {winner:element2.uid}, async function (err) {
                            if (err){
                                console.log(err)
                
                            }
                            else{
                                const user= await UserModel.findOne({_id:element2.uid});
                                const product= await ProductModel.findOne({_id:element1._id});


                                console.log("updated winner user");
                                const email_message = "<h1>Congratulations<h1><h3> Dear "+user.fname + " you have won the bidding on the product "+ product.pname +" .</br></h3><h3> at amount of "+ product.high_bid +"</h3><h3></br>Thank you "+"</h3>" ;
                                // console.log(email_message);
                                 const to_email =user.email;
                 // These id's and secrets should come from .env file.
                 const CLIENT_ID = '805190540897-e94v2ssuofsgkk7ep9g75um6pb3m2h55.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04qIkZt0TF0QHCgYIARAAGAQSNwF-L9Ir_oqQDRkYVYPqsMncNVFFGG159_xLvjJBzNVxTU2ISQ58Vaw8xw5o3jUdTEk4lYTuJkE';
                 
                 const oAuth2Client = new google.auth.OAuth2(
                   CLIENT_ID,
                   CLEINT_SECRET,
                   REDIRECT_URI
                 );
                 oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
                 
                 async function sendMail() {
                   try {
                     const accessToken = await oAuth2Client.getAccessToken();
                 
                     const transport = nodemailer.createTransport({
                       service: 'gmail',
                       auth: {
                         type: 'OAuth2',
                         user: 'kirandom52@gmail.com',
                         clientId: CLIENT_ID,
                         clientSecret: CLEINT_SECRET,
                         refreshToken: REFRESH_TOKEN,
                         accessToken: accessToken,
                       },
                     });
                 
                     const mailOptions = {
                       from: 'KIRAN <kirandom52@gmail.com>',
                       to: String(to_email),
                       subject: 'Bill reciept',
                       text: 'Bill reciept',
                       html: String(email_message),
                     };
                 
                     const result = await transport.sendMail(mailOptions);
                     return result;
                   } catch (error) {
                     return error;
                   }
                 }
                 
                 sendMail()
                   .then((result) => console.log('Email sent...', result))
                   .catch((error) => console.log(error.message));
                 
                            }
                        });
                        
                    });
                }
                   ProductModel.updateOne({_id:element1._id}, 
            {expired:"yes"}, function (err) {
            if (err){
                console.log(err)

            }
            else{
                console.log("product status changed");
            }
        });
               }
            

          
    })
  
    //console.log(element1.product_name);
  });
  app.post("/addpayment",async(req,res)=>{
      console.log(req.body);
    const pid = req.body.pid;
    const uid = req.body.uid;
    const amount = req.body.amount;
    days = req.body.days;
    const user= await UserModel.findOne({_id:uid});
    const product= await ProductModel.findOne({_id:pid});

   await ProductModel.updateOne({_id :pid},{promostatus:'active'})
    //console.log(req.body.email);
    
  
          newPayment = new PaymentModel({
            pid:pid,
            uid:uid,
            username:user.fname,
            productname:product.pname,
            amount:amount,
            days:days,

        
         })
         await newPayment.save(function (err, docs){
            if (err){
               
                console.log(err);
                res.send({write_status: "fail"});

            }
            else{
                console.log("Ppaymet added");
                console.log("Updated Docs : ", docs._id);
                //mail
                const email_message = "<h1>"+"Bill ID : "+ docs._id + '<h1><h3> Dear '+user.fname + " we have recieved your payment of rupees "+amount+" .</br></h3><h3> your product "+product.pname +" will be promted for "+ days+" days.</h3><h3></br>Thank you "+"</h3>" ;
               // console.log(email_message);
                const to_email =user.email;
// These id's and secrets should come from .env file.

const CLIENT_ID = '805190540897-e94v2ssuofsgkk7ep9g75um6pb3m2h55.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04qIkZt0TF0QHCgYIARAAGAQSNwF-L9Ir_oqQDRkYVYPqsMncNVFFGG159_xLvjJBzNVxTU2ISQ58Vaw8xw5o3jUdTEk4lYTuJkE';
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'kirandom52@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'KIRAN <kirandom52@gmail.com>',
      to: String(to_email),
      subject: 'Bill reciept',
      text: 'Bill reciept',
      html: String(email_message),
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));

                //end mail
                res.send({write_status: "success",BillId:docs._id});

            };
        
       

   }) 
    
})

app.post("/getactiveadcount",(req,res)=>{
    email=req.body.email;
    ProductModel.count({email:email,expired:'no'},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             //console.log("active"+ result);
             
            res.send({activeAdCount: result});
        }
    })
});
app.post("/getadcount",(req,res)=>{
    ProductModel.count({email:req.body.email},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             //console.log(result);
             
            res.send({adCount: result});
        }
    })
});
app.post("/promocount",(req,res)=>{
    ProductModel.count({email:req.body.email,promostatus:'active'},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             console.log("promo"+result);
             //admin is reduced
      
            res.send({promoCount: result});
        }
    })
    });
app.get("/getUsers",(req,res)=>{
UserModel.find({},  (err,result) =>{
    if(err){
        res.json(err);
     }else {
         res.json(result);
     }
})
});
app.post("/get-bill",(req,res)=>{
    bid = req.body.bid;
    PaymentModel.find({_id:bid},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             res.json(result);
         }
    })
    });
app.get("/promocount",(req,res)=>{
    ProductModel.count({promostatus:'active'},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             console.log("promo"+result);
             //admin is reduced
      
            res.send({promoCount: result});
        }
    })
    });
  
app.get("/getusercount",(req,res)=>{
    UserModel.count({},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             console.log(result);
             //admin is reduced
             result = result-1;
            res.send({usercount: result});
        }
    })
    });
    app.get("/getnewusercount",(req,res)=>{
        UserModel.count({status:"un_approved"},  (err,result) =>{
            if(err){
                res.json(err);
             }else {
                 console.log("new user"+result);
                 //admin is reduced
                //  result = result-1;

                res.send({newusercount: result});
            }
        })
        });
app.get("/getadcount",(req,res)=>{
        ProductModel.count({},  (err,result) =>{
            if(err){
                res.json(err);
             }else {
                 //console.log(result);
                 
                res.send({adCount: result});
            }
        })
});

app.get("/getactiveadcount",(req,res)=>{
            ProductModel.count({expired:'no'},  (err,result) =>{
                if(err){
                    res.json(err);
                 }else {
                     //console.log("active"+ result);
                     
                    res.send({activeAdCount: result});
                }
            })
 });

app.get("/reportcount",(req,res)=>{
                ReportModel.count({},  (err,result) =>{
                    if(err){
                        res.json(err);
                     }else {
                         //console.log("active"+ result);
                         res.send({reportcount: result});

                    }
                })
        
 });

app.get("/uncheckedreportcount",(req,res)=>{
                    ReportModel.count({status:'unchecked'},  (err,result) =>{
                        if(err){
                            res.json(err);
                         }else {
                             //console.log("active"+ result);
                             res.send({uncheckedreportcount: result});

                            }
                    })

            
});
app.get("/getReports",(req,res)=>{
    ReportModel.find({},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             res.json(result);
         }
    })
});
app.get("/get-bids",(req,res)=>{
        BidModel.find({},  (err,result) =>{
            if(err){
                res.json(err);
             }else {
                 res.json(result);
             }
        })
});
app.post("/set-reason",async(req,res)=>{
            const id = req.body.id;
            const reason = req.body.reason;
            const name = req.body.name;
            //console.log(req.body.email);
            try{
                 UserModel.updateOne({id:id}, 
                    {status:"reported"}, function (err, docs) {
                    if (err){
                        console.log(err)
                        res.send({update_status: "fail"});
        
                    }
                    else{
                        res.send({update_status: "success"});
                        console.log("Product Reported");
                       // console.log("Updated Docs : ", docs);
                    }
                });
                
        
            }
            catch(err){
                console.log(err);
                res.send({update_status: "fail"});
        
            }
            try{
                const  newReport = new ReportModel({
                    pid:id,
                    reason:reason,
                    name:name,
                 })
                 await newReport.save();
                
               
       
           }
            catch(err){
                console.log(err);
                res.send({update_status: "fail"});
        
            }
})
app.get("/get-products",(req,res)=>{
            ProductModel.find({},  (err,result) =>{
                if(err){
                    res.json(err);
                 }else {
                     res.json(result);
                 }
            }).sort({promostatus: 1})
});
app.get("/getPayments",(req,res)=>{
                PaymentModel.find({},  (err,result) =>{
                    if(err){
                        res.json(err);
                     }else {
                         res.json(result);
                     }
                }).sort({promostatus: 1})
});
app.post("/get-bidded-products",(req,res)=>{
                const uid = req.body.uid;
                BidModel.aggregate([
                    { $lookup:
                        {
                           from: "products",
                           localField: "pid",
                           foreignField: "id",
                           as: "product"
                        }
                        
                    },
                    {$match:
                        {'uid': uid,
                          } },
                    
                    
                    
                ],  (err,result) =>{
                    if(err){
                        res.json(err);
                     }else {
                         console.log(result);
                        res.json(result);

                     }
                })
});
app.post("/get-bids",(req,res)=>{
                pid = req.body.id;
                BidModel.find({pid:pid},  (err,result) =>{
                    if(err){
                        res.json(err);
                     }
                     else {
                         res.json(result);
                     }
                }).sort({bid: -1})
});
app.post("/get-user-bids",(req,res)=>{
                    uid = req.body.uid;
                    console.log('call bids called')
                    BidModel.find({uid:uid},  (err,result) =>{
                        if(err){
                            res.json(err);
                         }
                         else {
                             res.json(result);
                         }
                    })
});    
app.post("/createUsers",async (req,res)=>{
    if(!req.files.file ||!req.files.profilefile)
    {
     //console.log("no files selected");   
     res.send({error_status: "no_id"});

    }
    else{
        try{
            const newpath = __dirname + "/Images/UserDocuments/";

            const file = req.files.file;
            const profilefile = req.files.profilefile;

                console.log(file.mimetype);
                if((file.mimetype != 'image/jpeg' ))
                {
                    res.send({error_status: "wrong_format"});
                }
                else
                {
                    const img_name = Date.now()+req.body.filename;
                    const profile_img_name = Date.now()+req.body.profilefilename;

                    const fname = req.body.fname;
                    const lname = req.body.lname;
                    const phone = req.body.phone;
                    const address = req.body.address;
                    const district = req.body.district;
                    const state = req.body.state;
                    const email = req.body.email;
                    const password = req.body.password;
                    const newUser = new UserModel({
                        fname:fname,
                        lname:lname,
                        phone:phone,
                        address:address, 
                        district:district,
                        state:state,
                        email:email,
                        password:password,
                        id:img_name,
                        profile:profile_img_name,
                    });
                    await newUser.save();
                    console.log(file.mimetype);
                    file.mv(`${newpath}${img_name}`, (err) => {
                        if (err) {
                        console.log(err);
                        res.send({ message: "File upload failed" });
                        // return;
                        }
                    });

                    profilefile.mv(`${newpath}${profile_img_name}`, (err) => {
                        if (err) {
                        console.log(err);
                        res.send({ message: "File upload failed" });
                        // return;
                        }
                    });
                    console.log("user: "+ fname +" created");
                    res.json({status:"ok"});
                }
            }
            catch(err)
                {
                    console.log(err);
                    res.send({error_status: "fail"});
                } 
        }
})
app.post("/updateUsers",async (req,res)=>{
    console.log(req.body);
        try{

                 

                    const fname = req.body.fname;
                    const lname = req.body.lname;
                    const phone = req.body.phone;
                    const address = req.body.address;
                    const uid = req.body.uid;

               
                     UserModel.updateOne({_id:uid},{fname:fname,lname:lname,phone:phone,address:address},function(err){
                        if(err)console.log(err);
                    });
                    console.log("user: "+ fname +" update");
                    res.json({status:"ok"});
                }
            
            catch(err)
                {
                    console.log(err);
                    res.send({error_status: "fail"});
                } 
        
})
app.post('/checkpassword',async (req,res)=>{
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    try{
        user = await UserModel.findOne({email:email,password:password})
        if(!user){
            res.send({checkPassword: "fail"});

        }
        else{
            res.send({checkPassword: "success"});

        }
    }
    catch(err){
        console.log(err);
    }
})
app.post('/updatepassword',async (req,res)=>{
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    try{
        user = await UserModel.findOneAndUpdate({email:email},{password:password})
        if(!user){
            res.send({updatePassword: "fail"});

        }
        else{
            res.send({updatePassword: "success"});

        }
    }
    catch(err){
        console.log(err);
    }
})
app.post("/login",async (req,res)=>{
    try{
    const user= await UserModel.findOne({email:req.body.email,password :req.body.password,})
    if(user){
        //console.log(user.fname);
               const token = jwt.sign ({
            name:user.fame,
            email :req.body.email,

        },'secret783')
        if (req.body.email=="admin@maxbid.com")
        {
            res.send({login_status: "success" , id: user._id,user: token ,status:"admin",fname : user.fname});
        }
        else{
            console.log(user._id);
        res.send({login_status: "success" , user: token ,id: user._id,status:user.status,fname : user.fname,profile:user.profile});
        }
    }
    else{
        console.log("user not ok");
res.send({login_status:"fail"});    }
}
    catch(err){
        console.log(err);
    }
})
app.post('/forgotcheck',async (req,res)=>{

    console.log(req.body)
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const val = Math.floor(1000 + Math.random() * 9000);
        await UserModel.findOneAndUpdate({email:req.body.email},{otp:val});
        const email_message = "<h1>Your OTP is "+val+"</h1>"
        try{
                const oAuth2Client = new google.auth.OAuth2(
                    CLIENT_ID,
                    CLEINT_SECRET,
                    REDIRECT_URI
                );
                oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
                
                async function sendMail() {
                    try {
                    const accessToken = await oAuth2Client.getAccessToken();
                
                    const transport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        type: 'OAuth2',
                        user: 'kirandom52@gmail.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLEINT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken,
                        },
                    });
                
                    const mailOptions = {
                        from: 'KIRAN <kirandom52@gmail.com>',
                        to: String(req.body.email),
                        subject: 'OTP for Password Reset',
                        text: 'OTP for Password Reset',
                        html: String(email_message),
                    };
                
                    const result = await transport.sendMail(mailOptions);
                    return result;
                    } catch (error) {
                    return error;
                    }
                }
                
                sendMail()
                    .then((result) => console.log('Email sent...', result))
                    .catch((error) => console.log(error.message));
                
        }
        catch(error){
            console.log(error)
          }
}
else{

    res.send({ message: 'Email not Registered' });
  }
})
app.post("/changepassword",async (req,res)=>{
    console.log(req.body);
      const email= req.body.email;
      const password= req.body.password;
      const  otp = req.body.otp;
      const user1 = await UserModel.findOne({ email:email });
      if (user1) {
          
        
        console.log(user1.otp);
        console.log(otp);
        if(user1.otp === Number(otp)){
          // console.log("otp match")
        await UserModel.findOneAndUpdate({email:email},{password:password});
        const user= await UserModel.findOne({email:req.body.email,password :req.body.password,})
        if(user){
            //console.log(user.fname);
                   const token = jwt.sign ({
                name:user.fame,
                email :req.body.email,
    
            },'secret783')
            if (req.body.email=="admin@maxbid.com")
            {
                res.send({login_status: "success" , id: user._id,user: token ,status:"admin",fname : user.fname});
            }
            else{
            console.log(user._id);
            res.send({login_status: "success" , user: token ,id: user._id,status:user.status,fname : user.fname,profile:user.profile});
            }
    
        
      }
      else{
        console.log("user not ok");
            res.send({login_status:"fail"});    }

      }
      else{
        res.send({ message: 'Invalid OTP' });
        return;
      }

}
})
//Deleting a user
app.post("/deleteuser",async(req,res)=>{
    try{
        await UserModel.deleteOne({email:req.body.email});
        res.send({delete_status: "success"});

        console.log("user deleted");

    }
    catch(err){
        console.log(err);
        res.send({delete_status: "fail"});

    }
})
app.post("/place-bid",async(req,res)=>{
    
    try{
        console.log(req.body);
        const pid = req.body.pid;
         const  bid= req.body.bid;

         const  uid= req.body.uid;
         const isbid = await BidModel.findOne({pid:pid,uid:uid});

         const user = await UserModel.findOne({_id:uid});
         const username = user.fname;
         if(isbid){
             await BidModel.updateOne({pid:pid,uid:uid},{bid:bid});
 
         }
         else{
        const  newBid = new BidModel({
           pid:req.body.pid,
           uid:req.body.uid,
           bid:req.body.bid,
            name:username
        })
        await newBid.save();
        }   
        const highestbid = await ProductModel.findOne({_id:pid});
        if(!highestbid)
        {
            console.log("no product found with high bid");
        }
        else{
        if(bid > highestbid.high_bid){
            ProductModel.updateOne({_id :pid}, 
                {high_bid:bid}, function (err) {
                if (err){
                    console.log(err)
    
                }
                else{

                    console.log("highest bid updated");
                }
            });
        }
    }   
        
        res.send({bidstatus:"sucess"});
        // console.log(req.body);
   

    }
    catch(err){
        console.log(err);
        res.send({delete_status: "fail"});

    }
})
app.post("/get-bid",async(req,res)=>{
    try{
        console.log(req.body.pid);

        ProductModel.find({_id: mongoose.Types.ObjectId(String(req.body.pid))},  (err,result) =>{
            if(err){
                res.json(err);
             }else {
                 res.json(result);
             }
        })


    
   

    }
    catch(err){
        console.log(err);
        res.send({delete_status: "fail"});

    }
})
//Approving User
app.post("/approveUser",async(req,res)=>{
    email=req.body.email;
    //console.log(req.body.email);
    try{
         UserModel.updateOne({email:String(email)}, 
            {status:"approved"}, function (err, docs) {
            if (err){
                console.log(err)
                res.send({approve_status: "fail"});

            }
            else{
                res.send({approve_status: "success"});
                console.log("user approved");
                console.log("Updated Docs : ", docs);
            }
        });
        

    }
    catch(err){
        console.log(err);
        res.send({approve_status: "fail"});

    }
})
app.post("/UpdateProductPromotion",async(req,res)=>{
    pid= req.body.pid;
    //console.log(req.body.email);
    try{
         ProductModel.updateOne({_id:pid}, 
            {promostatus:"active"}, function (err, docs) {
            if (err){
                console.log(err)
                res.send({approve_status: "fail"});

            }
            else{
                res.send({approve_status: "success"});
                console.log("Updated Product Promotion Status");
               // console.log("Updated Docs : ", docs);
            }
        });
        

    }
    catch(err){
        console.log(err);
        res.send({approve_status: "fail"});

    }
})
app.post("/disableProduct",async(req,res)=>{
    pid=req.body.pid;
    //console.log(req.body.email);
    try{
        ReportModel.updateMany({pid:pid}, 
            {status:"checked"}, function (err, docs) {
            if (err){
                console.log(err)

            }
            else{
                console.log("status updated");
                console.log("Updated Docs : ", docs);
            }
        });
         ProductModel.updateOne({_id:pid}, 
            {status:"disabled"}, function (err, docs) {
            if (err){
                console.log(err)
                res.send({disable_status: "fail"});

            }
            else{
                res.send({disable_status: "success"});
                console.log("user approved");
                console.log("Updated Docs : ", docs);
            }
        });
        
        

    }
    catch(err){
        console.log(err);
        res.send({approve_status: "fail"});

    }
})
//adding product
app.post("/addproduct",async (req,res)=>{
    console.log(req.body.category);
    if(!req.files)
    {
     //console.log("no files selected");   
     res.send({error_status: "no_photo"});
     
    }
    else{
        try{
            const newpath1 = __dirname + "/Images/Products/";

            const file1 = req.files.file;
                if((file1.mimetype != 'image/jpeg'  )&&(file1.mimetype != 'image/png'  ))
                {
                    console.log("not file");
                    res.send({error_status: "wrong_format"});
                }
                else
                {
                    console.log("inside else");
            console.log(req.body.category);
            const img_name1 = Date.now()+req.body.filename;
            const pname = req.body.pname;
            const bid = req.body.bid;
            const days = Number(req.body.days);
            const location = req.body.location;
            const information = req.body.information;
            const email = req.body.email;
            const date1 = new Date();
            const category = req.body.category;
            date1.setDate(date1.getDate() + days);
            const  newProduct = new ProductModel({
                pname:pname,
                bid:bid,
                days:days,
                location:location,
                information:information,
                image:img_name1,
                email:email,
                category:category,
date:date1,
            })
            await newProduct.save(async function (err, docs){
                if (err){
                    console.log(err);
                }
                else{
                    console.log(docs);
                    await ProductModel.updateOne({_id:docs._id},
                        {id:docs._id});
                };
            
           
    
       });
            file1.mv(`${newpath1}${img_name1}`, (err) => {
                if (err) {
                console.log(err);
                res.send({ message: "File upload failed" });
                // return;
                }
            });
            console.log("user: "+ pname +" created");
            res.json({status:"ok"});
        }
    }
        catch(err){
console.log(err);
        }
    }
})
app.post("/getUserName",async (req, res) => {
    const user= await UserModel.findOne({email:req.body.email});
    const name = user.fname;
    res.send({name: name})
})
app.post("/get-product",async (req, res) => {
     console.log("get product ccalled")
     console.log(req.body.id);
    pid = req.body.id;
    ProductModel.find({_id:pid},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             res.json(result);
         }
    })
})
app.post("/get-user",async (req, res) => {
    console.log("getuser called");
  console.log(req.body.uid);
    uid = req.body.uid;
    UserModel.find({_id:uid},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             console.log(result);
             res.json(result);
         }
    })
})
app.get("/getRate",async(req,res)=>{
    console.log("getrate called");
    try{
 RateModel.find({},function(err,rates)
 {
     if(err){
         console.log(err);
        // res.send({message:"fail"});
     }
     else{

         if(!rates[0]){

         }
         else{

         
       //  console.log(rates);
     res.send({date:rates[0].date,rate:rates[0].rate});
    }
    }
 }).sort({date:-1})
}
catch(err){
    console.log(err);
}
 //  console.log(rateobject);
//    res.send({rate:rateobject});
    
})
app.post("/updateRate",async(req,res)=>{
    //console.log("rate  "+ req.body.rate)
    const  newRate = new RateModel({
        rate:req.body.rate,
        date : new Date(),
    })
    try{
       await newRate.save();
      //  console.log("rate updated in server");

        res.send({message:"sucess"});
        
     }
 catch(err){
     console.log(err);
     res.send({message:"fail"});
 }
})
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log("Server Started");
})