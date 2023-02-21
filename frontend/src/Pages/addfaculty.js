// import React from "react";
import "./addfacultyStyles.css";
import { getUserData } from "../Auth";
import React, { useState } from 'react';
import axios from 'axios';

export default function Addfaculty() {
    let dept=getUserData().hodDto.dept;
    const [faculty, setFaculty] = useState({deptid:dept,id:"",name:"",email:"",password:""});

    const addfacultyform = (e) => {
        e.preventDefault();
        console.log(faculty);
        axios.post('http://localhost:8080/HOD/addfaculty')
            .then(response => console.log(response))
            .catch(error => console.error(error));
    }

    return (
        <>
            <div className="cont-1">
                <form onSubmit={addfacultyform} >
                    <h3 className="label">ID:</h3>
                    <input type="text" onChange={(e) => { setFaculty({ ...faculty, id: e.target.value }) }} value={faculty.id} />
                    <h3 className="label">Name:</h3>
                    <input type="text" onChange={(e) => { setFaculty({ ...faculty, name: e.target.value }) }} value={faculty.name} />
                    <h3 className="label">Email:</h3>
                    <input type="email" onChange={(e) => { setFaculty({ ...faculty, email: e.target.value }) }} value={faculty.email} />
                    <h3 className="label">Password:</h3>
                    <input type="text" onChange={(e) => { setFaculty({ ...faculty, password: e.target.value }) }} value={faculty.password} />
                    <input type="submit" className="SubmitButton coolBeans" value="Add Faculty" />
                </form>
            </div>
        </>
    );
}