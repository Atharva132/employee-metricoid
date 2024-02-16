const mongoose = require('mongoose');
const {Schema} = mongoose;

const employeeSchema = new Schema({
    name: String,
    email: String,
    phone: Number
});



module.exports = mongoose.model('Employee', employeeSchema);