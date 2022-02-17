const mongoose = require('mongoose');

const Connection = () => {
    mongoose.connect(process.env.CONNECTION_URL).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(err);
    });
}
module.exports = Connection;