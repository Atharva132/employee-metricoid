require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Employee = require('./models/employee');

const app = express();

const dbUrl = process.env.DB_Url;

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

app.use(cors());
app.use(bodyParser.json());


app.get('/', async (req, res) => {
    try{
        //Find all employees and return it
        const employees = await Employee.find();
        res.json(employees);
    } catch(error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/', async (req, res) => {
    try{
        //create a new employee
        const newEmployee = new Employee({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone});
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch(error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    try {
        //Find employee by its id and update it
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/:employeeId', async (req, res) => {
    const { employeeId } = req.params;
    try {
        // Find the employee by ID and delete it
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
        if (!deletedEmployee) {
        return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(deletedEmployee);
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(4002, () => {
    console.log(`server running on port 4002`)
});