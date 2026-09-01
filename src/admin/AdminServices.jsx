
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-services.css";

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

function AdminServices() {
    const [services, setServices] = useState([]);
    const [name, setName] = useState("");
    const [type, setType] = useState("Car");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [repairMode, setRepairMode] = useState("General Service");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadServices = () => {
        getData("services")
            .then((data) => setServices(data))
            .catch(() => setServices([]));
    };

    useEffect(() => {
        loadServices();
    }, []);

    const saveService = (e) => {
        e.preventDefault();

        if (!name || !price || !duration) {
            alert("Please fill all fields.");
            return;
        }

        const data = {
            name: name,
            vehicleType: type,
            price: price,
            duration: duration,
            repairMode: repairMode,
            status: "Active"
        };

        if (editId) {
            updateData("services", editId, data)
                .then(() => {
                    alert("Service updated.");
                    clearForm();
                    loadServices();
                })
                .catch(() => alert("Unable to update service."));
        } else {
            addData("services", data)
                .then(() => {
                    alert("Service added.");
                    clearForm();
                    loadServices();
                })
                .catch(() => alert("Unable to add service."));
        }
    };

    const editService = (item) => {
        setShowForm(true);
        setName(item.name);
        setType(item.vehicleType || "Car");
        setPrice(item.price);
        setDuration(item.duration);
        setRepairMode(item.repairMode || "General Service");
        setEditId(item.id);
    };

    const removeService = (id) => {
        if (!window.confirm("Delete this service?")) {
            return;
        }

        deleteData("services", id)
            .then(() => {
                alert("Service deleted.");
                loadServices();
            })
            .catch(() => alert("Unable to delete service."));
    };

    const clearForm = () => {
        setShowForm(false);
        setName("");
        setType("Car");
        setPrice("");
        setDuration("");
        setRepairMode("General Service");
        setEditId(null);
    };

    return (
        <>
            <PageHeader
                title="Services"
                subtitle="Manage all services in one place"
                action="Add Service"
                onAction={() => {
                    clearForm();
                    setShowForm(true);
                }}
            />
            <section className="panel">
                {showForm && (
                    <form className="user-form" onSubmit={saveService}>
                        <label>
                            Service Name
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Vehicle Type
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option>Car</option>
                                <option>Bike</option>
                            </select>
                        </label>
                        <label>
                            Repair Mode
                            <select
                                value={repairMode}
                                onChange={(e) => setRepairMode(e.target.value)}
                            >
                                <option>General Service</option>
                                <option>Engine Repair</option>
                                <option>Oil Change</option>
                                <option>Brake Repair</option>
                                <option>Battery Service</option>
                                <option>Tyre Service</option>
                                <option>AC Service</option>
                                <option>Chain Service</option>
                            </select>
                        </label>
                        <label>
                            Price
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </label>
                        <label>
                            Duration
                            <input
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="2 Hours"
                            />
                        </label>
                        <button type="submit">
                            {editId ? "Update Service" : "Add Service"}
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
                                <th>Service</th>
                                <th>Vehicle</th>
                                <th>Repair Mode</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.vehicleType}</td>
                                    <td>{item.repairMode}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.duration}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-action"
                                            onClick={() => editService(item)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-action"
                                            onClick={() => removeService(item.id)}
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

export default AdminServices;

