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
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchEmployees();
    },[])

    const url = 'https://employee-metricoid.vercel.app';

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

    const validateForm = () => {
      let isValid = true;
      const errors = {};
  
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }
  
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email is invalid';
        isValid = false;
      }
  
      if (!formData.phone.trim()) {
        errors.phone = 'Phone is required';
        isValid = false;
      }
  
      setErrors(errors);
      return isValid;
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!validateForm()) {
          return;
        }
        try {
            if (isUpdate) {
                setFormData({ name: '', email: '', phone: '' }); 
                setIsUpdate(false);
                await axios.put(`${url}/${updateId}`, formData);
            } else {
                await axios.post(`${url}/`, formData);
            }
            fetchEmployees();
            setFormData({ name: '', email: '', phone: '' });
            setShowForm(false); 
            setIsUpdate(false);
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
          setErrors({});
            setFormData({ name: employee.name, email: employee.email, phone: String(employee.phone) });
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

    const button = `.fixed-width-btn {
      width: 200px;
    }`


    return (<div className="container mt-4">
    <div className="row justify-content-center">
      
      <div className="col-lg-6 col-md-10 col-sm-10">
      <h2 className="mb-3">Employee <b>Details</b></h2>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
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
                  <td className="d-flex flex-column flex-md-row justify-content-md-center align-items-md-center">
                    <button className="btn btn-primary p-1 mx-2 my-1 my-md-0" onClick={() => handleUpdate(employee)}>Update</button>
                    <button className="btn btn-danger p-1 mx-2 my-1 my-md-0" onClick={() => handleDelete(employee._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div className="text-center">
      <button className="btn btn-primary mb-3 fixed-width-btn" onClick={() => {setShowForm(!showForm), setIsUpdate(false), setFormData({ name: '', email: '', phone: '' }), setErrors({})}}>{showForm ? 'Close' : 'Add Employee'}</button>
    </div>
    {showForm && (
      <div className="row justify-content-center">
        <div className="col-lg-4 col-mb-4 col-sm-8">
          <div className="card mb-4">
            <h3 className="card-header text-center">{isUpdate ? 'Update Employee' : 'Add Employee'}</h3>
            <div className="card-body">
              <form onSubmit={handleAddOrUpdate}>
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name && 'is-invalid'}`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email && 'is-invalid'}`}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="number"
                    className={`form-control ${errors.phone && 'is-invalid'}`}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    min="0" 
                    max="9999999999"
                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                    step="1"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <button type="submit" className="btn btn-success mt-4">{isUpdate ? 'Update Employee' : 'Add Employee'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>  
    )  
}

export default GetEmployeeData