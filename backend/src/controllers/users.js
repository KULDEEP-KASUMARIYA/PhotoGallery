const User = require("../models/users")
const config = require("../config/auth.config");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const multer = require("multer");
var jwt = require("jsonwebtoken");

// variable declaration
var filename = null;

exports.DuplicateUser = async (req, res) => {
    console.log(req.body);
    let a = await User.findOne({ email: req.body.email })
    if (a) {
        res.send({ 'error': 409 });
    }
    else {
        res.send({ 'error': 201 });
    }
}


 exports.upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/users/")
        },
        filename: function (req, file, cb) {
            filename = file.fieldname + "-" + Date.now() + ".jpg";
            cb(null, filename);
            // console.log(filename);
        }
    })
}).single("photo");


exports.usersAdd =  async (req, res) => {
    console.log(req.body);
    var photo;
    if (req.body.photo_url) {
        photo = req.body.photo_url;
    }
    else {
        photo = filename;
    }
    const addUser = new User(
        {
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            name: req.body.name,
            lname: req.body.lname,
            gender: req.body.gender,
            city: req.body.city,
            dob: req.body.dob,
            image: photo,
            provider_id: req.body.provider_id,
            provider_name: req.body.provider_name
        }
    );
    addUser.save().then(() => {
        res.status(201).send({ 'error': 201 });
    }).catch((e) => {
        console.log(e);
        res.status(404).send(e);
    })
}

exports.LoginUser = async (req, res) => {
    await User.findOne({ email: req.body.email }, (err, data) => {
        if (data) {
            var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
            if (passwordIsValid) {
                let token = jwt.sign({ id: data.id }, 'secret', {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    'success': 200,
                    id: data._id,
                    name: data.name,
                    lname: data.lname,
                    email: data.email,
                    accessToken: token
                });
            }
            else {
                res.send({ 'failed': 'incorrect_password' })
            }
        }
        else {
            res.send({ 'failed': 'user_not_found' })
        }
    });
}

exports.getUsers = async (req, res) => {
    var find = await User.find({}).select("-password");
    //console.log(find[0]['email']);
    res.status(200).send(find);
}

exports.deleteUser = (req, res) => {
    User.findOne({_id:req.body.id}, function(err , data){
        if(data){
            let isFilePresentInFolder = fs.existsSync("./public/users/"+ data.image)
            if(isFilePresentInFolder){
                fs.unlinkSync("./public/users/" + data.image);
            }
        }
    })
    User.deleteOne({ "_id": req.body.id }, function (err, result) {
        if (result) {
            res.send({ 'msg': 'Deleted' });
        }
    });
}

exports.changeStatus = (req, res) => {
    let status = req.body.status;
    let id = req.body.id;
    if (status === 1) {
        status = 0;
    }
    else {
        status = 1;
    }
    User.updateOne({ '_id': id }, { $set: { 'status': status } }, function (err, result) {
        if (result.nModified === 1) {
            res.status(200).send({ 'changedStatus': status });
        }
    })

}

exports.getUserData = (req, res) => {
    let userdata = User.findOne({ '_id': req.body.id }, (err, data) => {
        if (data) {
            res.status(200).send(data);
        }
        if (err) {
            res.status(404).send(err);
        }
    })
}

exports.updateUserData = (req, res) => {
    User.updateMany({ '_id': req.body.hidden_id },
        {
            $set:
            {
                'name': req.body.name,
                'lname': req.body.lname,
                'gender': req.body.gender,
                'city': req.body.city
            }
        }, function (err, result) {
            console.log(result)
            if (result.nModified === 1) {
                res.status(200).send({ 'UpdatedUser': 'UpdatedUser' })
            }
            if (result.nModified === 0) {
                res.status(200).send({ 'NotChanges': 'NotChanges' })
            }
            if (err) {
                res.status(404).send(err);
            }
        }
    )
}

exports.updateUserWithPhoto = async (req, res) =>{
    //console.log(req.body);
    let image = req.body.hidden_image;
    let ext = image.split('.')[1];

    if ((ext == 'jpg') || (ext == 'png' || (ext == 'jpeg'))) {
        fs.unlinkSync("./public/users/" + req.body.hidden_image);
    }
    User.updateMany({ '_id': req.body.hidden_id },
        {
            $set: {
                'name': req.body.name,
                'lname': req.body.lname,
                'gender': req.body.gender,
                'city': req.body.city,
                'image': filename
            }
        }, function (err, result) {
            if (result.nModified === 1) {
                res.status(200).send({ 'UpdatedUserWithPhoto': 'UpdatedUserWithPhoto' });
            }
            if (result.nModified === 0) {
                res.status(200).send({ 'NotChanges': 'NotChanges' });
            }
            if (err) {
                res.status(404).send(err);
            }
        }
    );
}