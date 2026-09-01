
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-vehicles.css";

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

function AdminVehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [type, setType] = useState("Car");
    const [model, setModel] = useState("");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadVehicles = () => {
        getData("vehicles")
            .then((data) => setVehicles(data))
            .catch(() => setVehicles([]));
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const save = (e) => {
        e.preventDefault();

        if (!name || !number || !model) {
            alert("Please fill all fields.");
            return;
        }

        const data = {
            name: name,
            number: number,
            type: type,
            model: model
        };

        if (editId) {
            updateData("vehicles", editId, data)
                .then(() => {
                    alert("Vehicle updated.");
                    clear();
                    loadVehicles();
                })
                .catch(() => alert("Unable to update vehicle."));
        } else {
            addData("vehicles", data)
                .then(() => {
                    alert("Vehicle added.");
                    clear();
                    loadVehicles();
                })
                .catch(() => alert("Unable to add vehicle."));
        }
    };

    const edit = (v) => {
        setShowForm(true);
        setName(v.name);
        setNumber(v.number);
        setType(v.type);
        setModel(v.model);
        setEditId(v.id);
    };

    const remove = (id) => {
        if (!window.confirm("Delete this vehicle?")) {
            return;
        }

        deleteData("vehicles", id)
            .then(() => {
                alert("Vehicle deleted.");
                loadVehicles();
            })
            .catch(() => alert("Unable to delete vehicle."));
    };

    const clear = () => {
        setShowForm(false);
        setName("");
        setNumber("");
        setType("Car");
        setModel("");
        setEditId(null);
    };

    return (
        <>
            <PageHeader
                title="Vehicles"
                subtitle="Manage registered vehicles"
                action="Add Vehicle"
                onAction={() => {
                    clear();
                    setShowForm(true);
                }}
            />
            <section className="panel">
                {showForm && (
                    <form className="user-form" onSubmit={save}>
                        <label>
                            Name
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </label>
                        <label>
                            Number
                            <input
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                            />
                        </label>
                        <label>
                            Type
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option>Car</option>
                                <option>Bike</option>
                            </select>
                        </label>
                        <label>
                            Model
                            <input
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            />
                        </label>
                        <button type="submit">
                            {editId ? "Update Vehicle" : "Add Vehicle"}
                        </button>
                        {editId && (
                            <button type="button" onClick={clear}>
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
                                <th>Vehicle</th>
                                <th>Number</th>
                                <th>Type</th>
                                <th>Model</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v) => (
                                <tr key={v.id}>
                                    <td>{v.id}</td>
                                    <td>{v.name}</td>
                                    <td>{v.number}</td>
                                    <td>{v.type}</td>
                                    <td>{v.model}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="edit-action"
                                            onClick={() => edit(v)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-action"
                                            onClick={() => remove(v.id)}
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

export default AdminVehicles;
