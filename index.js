const express = require ("express")
const app = express()
const mongoose = require('mongoose')
const UserModel = require("./models/users")
const BidModel = require("./models/bids")

const ReportModel = require("./models/reports")
const cron = require('node-cron');

const ProductModel = require("./models/Product")
const cors =require("cors")
const jwt = require('jsonwebtoken')
const path = require("path");
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });

app.use(express.json())
app.use(cors())
require("dotenv").config()

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
// mongoose.connect("mongodb+srv://kirandom:Kdmash123@cluster0.553jm.mongodb.net/maxbid?retryWrites=true&w=majority")
const fileUpload = require('express-fileupload');

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
                        console.log(element2.uid);
                        console.log(element2.bid);
                        console.log(element2.date);


                        ProductModel.updateOne({_id:element1._id},
                            {winner:element2.uid}, function (err) {
                            if (err){
                                console.log(err)
                
                            }
                            else{
                                console.log("updated winner user");
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
app.get("/getUsers",(res)=>{
UserModel.find({},  (err,result) =>{
    if(err){
        res.json(err);
     }else {
         res.json(result);
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
                        console.log("Updated Docs : ", docs);
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
                    app.post("/get-bidded-products",async(req,res)=>{
                        console.log('call product called')

                        pid = req.body.pid;
                         ProductModel.findOne({pid:pid},  (err,result) =>{
                            if(err){
                                res.json(err);
                             }
                             else {
                                 res.json(result);
                             }
                        })
                        });
    
app.post("/createUsers",async (req,res)=>{
    if(!req.files)
    {
     //console.log("no files selected");   
     res.send({error_status: "no_id"});

    }
    else{
        try{
            const newpath = __dirname + "/Images/UserDocuments/";
            const file = req.files.file;
                console.log(file.mimetype);
                if((file.mimetype != 'image/jpeg' ))
                {
                    res.send({error_status: "wrong_format"});
                }
                else
                {
                    const img_name = Date.now()+req.body.filename;
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
        res.send({login_status: "success" , user: token ,id: user._id,status:user.status,fname : user.fname});
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
        const pid = req.body.pid;
         const  bid= req.body.bid;

         const  uid= req.body.uid;
         const user = await UserModel.findOne({_id:uid});
         const username = user.fname;
        const  newBid = new BidModel({
           pid:req.body.pid,
           uid:req.body.uid,
           bid:req.body.bid,
            name:username
        })
        await newBid.save();

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
                console.log("Updated Docs : ", docs);
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
                   // console.log("inside else");

            const img_name1 = Date.now()+req.body.filename;
            const pname = req.body.pname;
            const bid = req.body.bid;
            const days = Number(req.body.days);
            const location = req.body.location;
            const information = req.body.information;
            const email = req.body.email;
            const date1 = new Date();
date1.setDate(date1.getDate() + days);
            const  newProduct = new ProductModel({
                pname:pname,
                bid:bid,
                days:days,
                location:location,
                information:information,
                image:img_name1,
                email:email,
date:date1,
            })
            await newProduct.save();
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
    // console.log(req.body.id+" body id ");
    pid = req.body.id;
    ProductModel.find({_id:pid},  (err,result) =>{
        if(err){
            res.json(err);
         }else {
             res.json(result);
         }
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log("Server Started");
})