
import React, { useEffect, useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-users.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState("user");
    const [password, setPassword] = useState("123456");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadUsers = () => {
        getUsers()
            .then((data) => setUsers(data))
            .catch(() => setUsers([]));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !mobile.trim()) {
            alert("Please fill all fields.");
            return;
        }

        const oldUser = users.find(
            (user) => String(user.id) === String(editId)
        );

        const userData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            mobile: mobile.trim(),
            password: password || (oldUser ? oldUser.password : "123456"),
            role: role
        };

        if (editId) {
            updateUser(editId, userData)
                .then(() => {
                    alert("User updated successfully.");
                    clearForm();
                    loadUsers();
                })
                .catch(() => alert("Unable to update user."));
        } else {
            addUser(userData)
                .then(() => {
                    alert("User added successfully.");
                    clearForm();
                    loadUsers();
                })
                .catch(() => alert("Unable to add user."));
        }
    };

    const handleEdit = (user) => {
        setShowForm(true);
        setName(user.name || "");
        setEmail(user.email || "");
        setMobile(user.mobile || "");
        setRole(user.role || "user");
        setPassword(user.password || "123456");
        setEditId(user.id);
    };

    const handleDelete = (id) => {
        if (!window.confirm("Do you want to delete this user?")) {
            return;
        }

        deleteUser(id)
            .then(() => {
                alert("User deleted successfully.");
                loadUsers();
            })
            .catch(() => alert("Unable to delete user."));
    };

    const clearForm = () => {
        setShowForm(false);
        setName("");
        setEmail("");
        setMobile("");
        setRole("user");
        setPassword("123456");
        setEditId(null);
    };

    return (
        <div className="users-page">
            <div className="users-heading">
                <div>
                    <h1>Users</h1>
                    <p>Manage registered users</p>
                </div>
                <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                        clearForm();
                        setShowForm(true);
                    }}
                >
                    Add User
                </button>
            </div>
            {showForm && (
                <form className="user-form" onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />
                    </label>
                    <label>
                        Email
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </label>
                    <label>
                        Mobile
                        <input
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="Mobile"
                            maxLength="10"
                        />
                    </label>
                    <label>
                        Role
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="center">Center</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <label>
                        Password
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        />
                    </label>
                    <button type="submit">
                        {editId ? "Update User" : "Add User"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={clearForm}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            )}
            <div className="users-table-box">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.mobile}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="icon-btn edit-icon"
                                        title="Edit User"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        type="button"
                                        className="icon-btn delete-icon"
                                        title="Delete User"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;

