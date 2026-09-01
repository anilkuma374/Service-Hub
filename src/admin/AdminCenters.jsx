
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-centers.css";

const PageHeader = ({ title, subtitle, action, onAction }) => {
    return (
        <div className="page-header">
            <div>
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            {action && (
                <button
                    className="primary-btn"
                    type="button"
                    onClick={onAction}
                >
                    {action}
                </button>
            )}
        </div>
    );
};

function AdminCenters() {
    const [centers, setCenters] = useState([]);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("Active");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadCenters = () => {
        getData("serviceCenters")
            .then((data) => setCenters(data))
            .catch(() => setCenters([]));
    };

    useEffect(() => {
        loadCenters();
    }, []);

    const saveCenter = (e) => {
        e.preventDefault();

        if (!name || !location || !phone) {
            alert("Please fill all fields.");
            return;
        }

        const data = {
            name: name,
            location: location,
            phone: phone,
            services: "Car & Bike",
            rating: "4.5",
            status: status
        };

        if (editId) {
            updateData("serviceCenters", editId, data)
                .then(() => {
                    alert("Center updated.");
                    clearForm();
                    loadCenters();
                })
                .catch(() => alert("Unable to update center."));
        } else {
            addData("serviceCenters", data)
                .then(() => {
                    alert("Center added.");
                    clearForm();
                    loadCenters();
                })
                .catch(() => alert("Unable to add center."));
        }
    };

    const editCenter = (item) => {
        setShowForm(true);
        setName(item.name || "");
        setLocation(item.location || "");
        setPhone(item.phone || "");
        setStatus(item.status || "Active");
        setEditId(item.id);
    };

    const removeCenter = (id) => {
        if (!window.confirm("Delete this center?")) {
            return;
        }

        deleteData("serviceCenters", id)
            .then(() => {
                alert("Center deleted.");
                loadCenters();
            })
            .catch(() => alert("Unable to delete center."));
    };

    const clearForm = () => {
        setShowForm(false);
        setName("");
        setLocation("");
        setPhone("");
        setStatus("Active");
        setEditId(null);
    };

    return (
        <>
            <PageHeader
                title="Service Centers"
                subtitle="Manage all service centers in one place"
                action="Add Center"
                onAction={() => {
                    clearForm();
                    setShowForm(true);
                }}
            />
            <section className="panel admin-centers-page">
                {showForm && (
                    <form className="user-form" onSubmit={saveCenter}>
                        <label>
                            Center Name
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Location
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </label>
                        <label>
                            Phone
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </label>
                        <label>
                            Status
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option>Active</option>
                                <option>Pending</option>
                                <option>Inactive</option>
                            </select>
                        </label>
                        <button type="submit">
                            {editId ? "Update Center" : "Add Center"}
                        </button>
                        {editId && (
                            <button type="button" onClick={clearForm}>
                                Cancel
                            </button>
                        )}
                    </form>
                )}
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Center</th>
                                <th>Location</th>
                                <th>Phone</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {centers.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.location}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.rating}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-action"
                                            onClick={() => editCenter(item)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-action"
                                            onClick={() => removeCenter(item.id)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

export default AdminCenters;

