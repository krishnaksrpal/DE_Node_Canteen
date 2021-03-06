var express = require("express");
var fileupload = require("express-fileupload");
var _ = require('lodash');
var bodyParser = require("body-parser");
// var multer = require("multer");
// var upload = multer();
var app = express();
var data = require("./data");
var users = data.getUsers();
var products = data.getProducts();
var trans = data.getTrans();
var notis = data.getNoti();
console.log(users);
// var date = new Date(users[1]["coupons"][0]["expire-date"])
// console.log(new Date(JSON.parse(JSON.stringify(date))).toString(),date.toString(), (new Date(2019,11,05).toString()),new Date(),new Date().toString(),new Date(new Date().toString()));
var port = 5000;
app.use(express.static("test"));
// app.use(bodyParser.json());
app.use(fileupload());
// app.use(upload.array());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get("/login", (req, res) => {
    users = data.getUsers();
    console.log(req.originalUrl, req.body, req.query);
    // res.send(req.query);
    req.body = req.query;
    let found = false;
    let user;
    for (var i = 0; i < users.length; i++) {
        if (users[i].username == req.body.username) {
            found = true;
            user = users[i];
            break;
        } else if (users[i].email == req.body.username) {
            found = true;
            user = users[i];
            break;
        } else if (users[i].enrollment == req.body.username) {
            found = true;
            user = users[i];
            break;
        }
    }
    if (found) {
        // console.log("found");
        if (user.password == req.body.password) {
            // console.log("logged in");
            var usersend = _.cloneDeep(user);
            delete usersend["password"];
            // usersend["username"] = req.body.username;
            console.log(users, "SENDING ", usersend);
            res.status(200).send({ 'obj': usersend });
        }
        else {
            var error = "the password you entered was wrong"
            res.status(403).send({ 'err': error })
        }
    }
    else {
        var error = "such user does not exist"
        res.status(404).send({ 'err': error })
    }
    // // res.redirect("/");
});
app.post("/signup", (req, res) => {
    // console.log(req.originalUrl,req.body,req.query);
    // res.type("application/json");
    // res.send(req.body);
    users = data.getUsers();
    let enroll = req.body.enrollment;
    let usern = req.body.username;
    let ema = req.body.ema;
    let found = false;
    for (var i = 0; i < users.length; i++) {
        if (users[i].username == enroll) {
            found = true;
            break;
        }
        else if (users[i].username == usern) {
            found = true;
            break;
        }
        else if (users[i].username == ema) {
            found = true;
            break;
        }

    }
    if (!found) {
        console.log("perfect");
        req.body["superuser"] = false;
        data.save(req.body);
        // res.sendDate = true;
        // res.send(req.body);
        let user = _.cloneDeep(req.body);
        delete user["password"];
        res.send({
            msg: "User registered",
            user: user
        })
        console.log(users);

    }
    else {
        console.log("not perfecto");
        res.send({
            msg: "User with same name exists"
        });
    }
})

app.post("/upload", (req, res) => {
    // console.log(req.body,req.query,req.params);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    else {
        console.log(req.body,req.query,req.params);
        // res.send(req.files.files1.name);
        let file = req.files.files1;
        console.log(file);
        // file.mv("./files/" + file.name, (err) => {
        //     console.log("done", err);
        //     html = "<html><head> </head><body> <h1><center><img src='http://localhost:5000/static/giphy.gif' width='200px'></center></h1><script>setTimeout(()=>{location.replace('/uploader/');},5000)"
        //     html += "</script></body></html>"
        //     res.send(html);
        // })
        res.send(req);
    }
})

app.post("/change/:type", (req, res) => {
    users = data.getUsers();
    console.log(req.params);
    console.log(req.body);
    console.log(req.query);
    let send;
    var found;
    var user;
    var flag;
    for (var i = 0; i < users.length; i++) {
        if (users[i].fullname == req.body["user"]["fullname"]) {
            found = i;
            user = _.cloneDeep(users[i]);
            break;
        }
    }
    let type = req.params["type"];
    let from = req.body["from"];
    // user= req.body["user"];
    if (type == "balance" || type == "coupons") {
        let check = JSON.stringify(user[type]);
        if (check == from) {
            let write = (req.body["to"])
            user[type] = write;
            data.change(user, found);
            delete user["password"];
            send = {
                msg: "done",
                user: user,
                type: type
            };
            console.log(users, user, send);
        }
    }
    else {
        if (user[type] == from) {
            user[type] = req.body["to"];
            data.change(user, found);
            delete user["password"];
            send = {
                msg: "done",
                user: user,
                type: type
            };
            console.log(users, user, send);
        }
        else {
            send = {
                msg: "error in prev. password"
            };
        }
    }
    res.send(send);
});

app.get("/noti/:user", (req, res) => {
    let send = [];
    notis = data.getNoti();
    notis.forEach(ele => {
        if (ele["to"] == req.params.user) {
            send.push(ele);
        }
    });
    let newA = notis.filter(ele => ele["to"] != req.params.user)
    console.log(newA);
    setTimeout(()=>{data.allNoti(newA);},1000);
    res.send(send);
});

app.post("/noti",(req,res)=>{

    console.log(req.body);
    setTimeout(()=>{data.saveNoti(req.body.noti);},10);
    
    res.send("ok");
})

app.post("/trans", (req, res) => {
    // console.log(req.params);
    // console.log(req.body);
    // console.log(req.query);
    trans = data.getTrans();
    let id = 0 ;
    id = trans.length+1;
    req.body["id"]=id;
    data.savetrans(req.body);
    res.send(req.body);
})
app.post("/trans/all", (req, res) => {
    console.log(req.body.trans);
    data.allTrans(req.body.trans);
    res.send("ok");
})
app.post("/trans/all/:user", (req, res) => {
    // console.log(req.body.trans);
    trans = data.getTrans();
    send = [];
    trans.forEach(ele => {
        if (!(ele["from"]["username"] == req.params.user)) {
            send.push(ele);
        }
    });
    send.push(...req.body.trans)
    data.allTrans(send);
    res.send("ok");
})
app.get("/trans", (req, res) => {
    res.send(data.getTrans());
})
app.get("/trans/:user", (req, res) => {
    trans = data.getTrans();
    let send = [];
    trans.forEach(ele => {
        if (ele["from"]["username"] == req.params.user) {
            send.push(ele);
        }
    });
    res.send(send);
})
app.get("/products", (req, res) => {
    products = data.getProducts();
    res.send(products);
});

app.listen(port, () => {
    console.log("listening on port " + port);
});


// var found = false;
// for(var i = 0; i < users.length; i++) {
//     if (users[i].Name == 'Magenic') {
//         found = true;
//         break;
//     }
// }