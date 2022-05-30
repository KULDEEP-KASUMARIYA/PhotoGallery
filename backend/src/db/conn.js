const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Users",{
    useCreateIndex :true,
    useNewUrlParser :true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected To mongoDb {-_-}");
}).catch((e)=>{
    console.log("Error While Connected To mongoDb");
    console.log(e);
})
    
