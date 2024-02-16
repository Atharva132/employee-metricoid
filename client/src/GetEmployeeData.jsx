import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css'

function GetEmployeeData () {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        fetchEmployees();
    },[])

    const url = 'http://192.168.1.25:4002';

    const fetchEmployees = async() => {
        try{
            const response = await axios.get(`${url}/`);
            setEmployees(response.data);
        } catch(error){
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (isUpdate) {
                setFormData({ name: '', email: '', phone: '' }); // Clear form after submission
                setIsUpdate(false); // Reset update mode
                await axios.put(`${url}/${updateId}`, formData);
            } else {
                await axios.post(`${url}/`, formData);
            }
            fetchEmployees();
            setFormData({ name: '', email: '', phone: '' }); // Clear form after submission
            setShowForm(false); // Hide the form after submission
            setIsUpdate(false); // Reset update mode
        } catch (error) {
            console.error(isUpdate ? 'Error updating employee:' : 'Error adding employee:', error);
        }
    };

    const handleUpdate = (employee) => {
        if (isUpdate && updateId === employee._id) {
            setShowForm(false);
            setIsUpdate(false);
            setUpdateId(null);
        } else {
            setFormData({ name: employee.name, email: employee.email, phone: employee.phone });
            setShowForm(true);
            setIsUpdate(true);
            setUpdateId(employee._id);
        }
    };
    

    const handleDelete = async (employeeId) => {
        try {
            await axios.delete(`${url}/${employeeId}`);
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    if(error) return <p>Error: {error}</p>
    if(loading) return <p>Loading...</p>


    return (<><div className="container text-center w-50">
    <h1 className="mt-4 mb-3">Employee List</h1>
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {employees.map(employee => (
          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.email}</td>
            <td>{employee.phone}</td>
            <td>
            <button className="btn btn-primary p-1 mx-3 my-2" onClick={() => handleUpdate(employee)}>Update</button>
                <button className="btn btn-danger p-1 me-1" onClick={() => handleDelete(employee._id)}>Delete</button>
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
    <div className="text-center">
      <button className="btn btn-primary mb-3" onClick={() => {isUpdate ? setShowForm(showForm): setShowForm(!showForm), setIsUpdate(false), setFormData({ name: '', email: '', phone: '' })}}>Add New</button>
    </div>
    {showForm && (
      <div className="d-flex justify-content-center text-center">
      <div className="justify-content-center align-content-center text-center  w-45 card mb-4">
        <h3 className="card-header">{isUpdate ? 'Update Employee' : 'Add Employee'}</h3>
        <div className="card-body">
          <form onSubmit={handleAddOrUpdate}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-success mt-4">{isUpdate ? 'Update Employee' : 'Add Employee'}</button>
          </form>
        </div>
      </div>
      </div>
    )}
  </>
)
}

export default GetEmployeeData