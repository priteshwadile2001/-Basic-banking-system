const router = require('express').Router();
const User = require('../model/user');
const history = require("../model/records");

//- home Route
router.get('/', (req, res) => {
    res.sendFile('index.html')
});

//- About Route
router.get('/about', (req, res) => {
    res.render('about', { title: "About" })
});


//- Add User Router
router.get('/addUser', (req, res) => {
    res.render('addUser', { title: 'Add User', msg: "" });
})

router.post('/add', (req, res) => {
    const { userName, userEmail, userAmount, mob } = req.body;
    const newUser = new User({
        name: userName,
        email: userEmail,
        mob: mob,
        amount: userAmount,
    });

    newUser.save().then((result) => {
        // console.log(result);
        res.render('addUser', { title: "success", msg: 'User Successfully Added...' })
    }).catch(err => {
        console.log(err)
    })

})

//- view all customers Route
router.get('/data', (req, res) => {
    const userdata = User.find();
    userdata.exec((err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.status(200).render('allUser', { title: 'DATA', records: data })
        }
    })


});

//- View and transfer Route
router.get('/view/:id', (req, res) => {
    const id = req.params.id;

    Promise.all([User.find({ "_id": id }), User.find()]).then(([userResult, allUserResult]) => {
        res.status(200).render('viewUser', { title: 'User Details', records: userResult, data: allUserResult });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

});

//- Delete User
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = User.findByIdAndDelete({ "_id": id });

    updatedUser.exec((err, data) => {
        if (err) { throw err }
        else {
            res.redirect('/data')
        }
    })

})

//- Delete History
router.get('/historydelete/:id', (req, res) => {
    const id = req.params.id;
    const updatedhistory = history.findByIdAndDelete({ "_id": id });

    updatedhistory.exec((err, data) => {
        if (err) { throw err }
        else {
            res.redirect('/history')
        }
    })

})

//- transfer Router
router.post('/transfer', (req, res) => {
    //- Geting form data
    let senderName = req.body.myname;
    let senderEmail = req.body.myemail;
    let senderId = req.body.idName;
    let reciverName = req.body.username;
    let reciverEmail = req.body.email;
    let sendAmount = req.body.amount;

    if (reciverName === 'Select User' || reciverEmail === 'Select Email') {
        res.render('success', { title: "success", errmsg: "Please Fill all fields!", value: "", msg: "" })
    }

    //- add transaction details
    const addHistory = new history({
        semail: senderEmail,
        remail: reciverEmail,
        sender: senderName,
        reciver: reciverName,
        amount: sendAmount
    })

    //- Finding reciver Name in DataBase
    const allUser = User.find({ "email": reciverEmail })

    allUser.exec((err, adata) => {
        if (err) {
            throw err;
        }
        else {
            adata.forEach((a) => {
                if (a.name != reciverName || a.email != reciverEmail) {
                    res.render('success', { title: "success", errmsg: "Reciver Details Not Matched!", value: "", msg: "" })
                } else {
                    var senderData = User.find({ "_id": senderId });
                    var reciverData = User.find({ "name": reciverName, "email": reciverEmail });

                    // ! Executing Sender Details
                    senderData.exec((err, sdata) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            // ! Executing Reciver Details
                            reciverData.exec((err, rdata) => {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    // ? This Loop is Getting Sender Data
                                    sdata.forEach(async (e) => {
                                        if (e.amount < sendAmount || e.name === reciverName) {

                                            res.render('success', { title: "success", errmsg: "Not Proceed Due TO Incorrect Information", value: "", msg: "" })
                                        }
                                        else {
                                            let senderUpdateAmount = parseInt(e.amount) - parseInt(sendAmount);
                                            await User.findOneAndUpdate({ "_id": senderId }, { "$set": { amount: senderUpdateAmount } });
                                            // -----------------
                                            addHistory.save().then((result) => {
                                            }).catch((err) => {
                                                console.log(err)
                                            })
                                            //---------------------------------
                                            // ? This Loop is Getting Sender Data
                                            rdata.forEach(async (e) => {
                                                let reciverUpdateAmount = parseInt(e.amount) + parseInt(sendAmount);
                                                await User.findOneAndUpdate({ "name": reciverName }, { "$set": { amount: reciverUpdateAmount } });
                                            })
                                            res.render('success', { title: "success", msg: "Transaction successfully Done!", value: "true" })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})



//-  Transfer History Route
router.get('/history', (req, res) => {

    const tHistory = history.find({});

    tHistory.exec((err, data) => {
        if (err) {
            throw err;
        }
        else {
            res.render('transferHistory', { title: "history", records: data })
        }
    });
});




module.exports = router;


