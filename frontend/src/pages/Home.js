import React, { useEffect, useState } from "react";
import axiox from "axios";
import axios from "axios";
import { formToJSON } from "axios";

const API_URL = "http://127.0.0.1:8000/api/students/";

function Home() {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({
        name: "",
        age: "",
        course: ""
    });
    const [editId, setEditId] = useState(null);

    // Fetch Data

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL);
            setStudents(res.data);
        }
        catch (error) {
            console.error("Error fetching data", error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    // Handle input

    const handleChange = (e) => {
        setForm({...form, [e.target.name]:
            e.target.value  })
    };

    // Add / Update

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            name: form.name,
            age: Number(form.age),
            course: form.course
        };
        
        try {
            if (editId) {
                await axios.put(API_URL + editId + "/", form);
            }
            else {
                await axios.post(API_URL, form);
            }

            setForm({ name: "", age: "", course: ""});
            setEditId(null);
            fetchData();
        }
        catch (error) {
            console.error("Error saving data", error.response?.data);
        }
    };

    // Delete

    const handleDelete = async (id) => {
         try {
             await axios.delete(API_URL + id + "/");
             fetchData();
         }
         catch (error) {
             console.error("Error Deleting data", error);
         }
    };

    // Edit

    const handleEdit = (student) => {
        setForm({
            name: student.name,
            age: student.age,
            course: student.course
        });
        setEditId(student.id);
    };

    return (
        <div style={{ padding: "20px"}}>
            <h2>Student CRUD</h2>

            {/* FORM */}
            <form onSubmit={handleSubmit}>

                <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name" />

                <input type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter Age" /> 

                <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="Enter Course" />

                <button typy="submit" class="btn btn-primary">
                    {editId ? "Update" : "Add"}
                </button>

            </form>
            <br /> 

            {/* TABLE */}

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Course</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((s) => (
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.age}</td>
                            <td>{s.course}</td>
                            <td>
                                <button onClick={() => handleEdit(s)}>Edit</button>
                                <button onClick={() => handleDelete(s.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Home;