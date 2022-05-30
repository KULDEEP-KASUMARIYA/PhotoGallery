const multer = require("multer");
const Products = require("../models/products")
const fs =  require("fs");
var filename;
exports.upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/products/")
        },
        filename: function (req, file, cb) {
            filename = file.fieldname + "-" + Date.now() + ".jpg";
            cb(null, filename);
            // console.log(filename);
        }
    })
}).single("productImage");

exports.addProductApi = async (req, res) => {
    const addProduct = new Products({
        catName: req.body.catName,
        proName: req.body.proName,
        proQty: req.body.proQty,
        proPrice: req.body.proPrice,
        proImage: filename
    });
    addProduct.save().then(() => {
        res.status(200).send({ 'status': 'added' })
    }).catch((e) => {
        res.status(409).send(e);
    })
}

exports.getProductApi = async (req, res) => {
    var find = await Products.find({}).select("-password");
    res.status(200).send(find);
}

exports.getProductDetails = (req, res) => {
    let proDetails = Products.findOne({ _id: req.body.id }, (err, data) => {
        if (data) {
            res.status(200).send(data);
        }
        if (err) {
            res.status(404).send(err)
        }
    })
}

exports.updateProDetails = async (req, res) => {
    if (req.body.fileName === 'isSelected') {
       let isFilePresentInFolder = fs.existsSync("./public/products/"+ req.body.hidden_image)
       if(isFilePresentInFolder){
        fs.unlinkSync("./public/products/" + req.body.hidden_image);
       }
       Products.updateOne({ _id: req.body.hidden_id },
        {
            $set: {
                catName: req.body.catName,
                proName: req.body.proName,
                proQty: req.body.proQty,
                proPrice: req.body.proPrice,
                proImage : filename

            }
        } , function(err, result){
            if(result.nModified===1){
                res.status(200).send({"status":"nModified"})
            }
            if(result.nModified===0){
                res.status(200).send({"status":"NoAnyChanges"})
            }
            if(err){
                res.status(202).send(err)
            }
            
        }
        
    )
    }   
    if (req.body.fileName === 'NotSelected') {
        Products.updateOne({ _id: req.body.hidden_id },
            {
                $set: {
                    catName: req.body.catName,
                    proName: req.body.proName,
                    proQty: req.body.proQty,
                    proPrice: req.body.proPrice

                }
            } , function(err, result){
                if(result.nModified===1){
                    res.status(200).send({"status":"nModified"})
                }
                if(result.nModified===0){
                    res.status(200).send({"status":"NoAnyChanges"})
                }
                if(err){
                    res.status(202).send(err)
                }
                
            }
            
        )
    }
}


exports.deleteProduct = async (req, res)=>{
    Products.findOne({_id:req.body.id}, function(err , data){
        if(data){
            let isFilePresentInFolder = fs.existsSync("./public/products/"+ data.proImage)
            if(isFilePresentInFolder){
                fs.unlinkSync("./public/products/" + data.proImage);
            }
        }
    })
    Products.deleteOne({_id:req.body.id} ,
        function(err ,result){
            if (result) {
                res.status(200).send({ 'msg': 'productDeleted' });
            }
            if(err){
                res.status(404).send(err);
            }
        })
}