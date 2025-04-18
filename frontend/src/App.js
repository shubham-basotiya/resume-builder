//  frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './App.css'; //  You'll need to create this

function App() {
  const [formData, setFormData] = useState({
    trade: '',
    firstName: '',
    lastName: '',
    fathersName: '',
    dob: '',
    maritalStatus: '',
    religion: '',
    education: '',
    address: '',
    contact: '',
    passportNumber: '',
    placeOfIssue: '',
    dateOfIssue: '',
    dateOfExpiry: '',
    ppType: '',
    designation: '',
    indiaExperience: '',
    abrDesignation: '',
    gccExperience: '',
    signature: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://resume-builder-backend-wine.vercel.app/', formData, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, 'resume.pdf');
    } catch (error) {
      console.error(error);
      alert('Error generating resume');
    }
  };

  return (
    <div className="App">
      <h1>Resume Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>Trade: <input type="text" name="trade" value={formData.trade} onChange={handleChange} /></label><br />
        <label>First Name: <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} /></label><br />
        <label>Last Name: <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} /></label><br />
        <label>Father's Name: <input type="text" name="fathersName" value={formData.fathersName} onChange={handleChange} /></label><br />
        <label>Date of Birth: <input type="text" name="dob" value={formData.dob} onChange={handleChange} /></label><br />
        <label>Marital Status: <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} /></label><br />
        <label>Religion: <input type="text" name="religion" value={formData.religion} onChange={handleChange} /></label><br />
        <label>Education: <input type="text" name="education" value={formData.education} onChange={handleChange} /></label><br />
        <label>Address: <input type="text" name="address" value={formData.address} onChange={handleChange} /></label><br />
        <label>Contact: <input type="text" name="contact" value={formData.contact} onChange={handleChange} /></label><br />
        <label>Passport Number: <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} /></label><br />
        <label>Place of Issue: <input type="text" name="placeOfIssue" value={formData.placeOfIssue} onChange={handleChange} /></label><br />
        <label>Date of Issue: <input type="text" name="dateOfIssue" value={formData.dateOfIssue} onChange={handleChange} /></label><br />
        <label>Date of Expiry: <input type="text" name="dateOfExpiry" value={formData.dateOfExpiry} onChange={handleChange} /></label><br />
        <label>Passport(ENR/ECNR): <input type="text" name="ppType" value={formData.ppType} onChange={handleChange} /></label><br />
        <label>India Designation: <input type="text" name="designation" value={formData.designation} onChange={handleChange} /></label><br />
        <label>India Experience: <input type="text" name="indiaExperience" value={formData.indiaExperience} onChange={handleChange} /></label><br />
        <label>Abroad Designation: <input type="text" name="abrDesignation" value={formData.abrDesignation} onChange={handleChange} /></label><br />
        <label>GCC Experience: <input type="text" name="gccExperience" value={formData.gccExperience} onChange={handleChange} /></label><br />
        <label>Signature: <input type="text" name="signature" value={formData.signature} onChange={handleChange} /></label><br />

        <button type="submit">Generate Resume</button>
      </form>
    </div>
  );
}

export default App;
