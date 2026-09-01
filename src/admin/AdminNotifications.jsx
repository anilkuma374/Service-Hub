
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-notifications.css";

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

function AdminNotifications() {
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("Info");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const load = () => {
        getData("notifications")
            .then((data) => setItems(data))
            .catch(() => setItems([]));
    };

    useEffect(() => {
        load();
    }, []);

    const save = (e) => {
        e.preventDefault();

        if (!message) {
            alert("Enter a notification.");
            return;
        }

        const data = {
            message: message,
            type: type,
            date: new Date().toLocaleString()
        };

        if (editId) {
            updateData("notifications", editId, data)
                .then(() => {
                    alert("Notification updated.");
                    clear();
                    load();
                })
                .catch(() => alert("Unable to update notification."));
        } else {
            addData("notifications", data)
                .then(() => {
                    alert("Notification added.");
                    clear();
                    load();
                })
                .catch(() => alert("Unable to add notification."));
        }
    };

    const edit = (n) => {
        setShowForm(true);
        setMessage(n.message || "");
        setType(n.type || "Info");
        setEditId(n.id);
    };

    const remove = (id) => {
        if (!window.confirm("Delete this notification?")) {
            return;
        }

        deleteData("notifications", id)
            .then(() => {
                alert("Notification deleted.");
                load();
            })
            .catch(() => alert("Unable to delete notification."));
    };

    const clear = () => {
        setShowForm(false);
        setMessage("");
        setType("Info");
        setEditId(null);
    };

    return (
        <>
            <PageHeader
                title="Notifications"
                subtitle="Manage marketplace notifications"
                action="Add Notification"
                onAction={() => {
                    clear();
                    setShowForm(true);
                }}
            />
            <section className="panel">
                {showForm && (
                    <form className="user-form" onSubmit={save}>
                        <label>
                            Message
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </label>
                        <label>
                            Type
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option>Info</option>
                                <option>Success</option>
                                <option>Warning</option>
                            </select>
                        </label>
                        <button type="submit">
                            {editId ? "Update Notification" : "Add Notification"}
                        </button>
                        {editId && (
                            <button type="button" onClick={clear}>
                                Cancel
                            </button>
                        )}
                    </form>
                )}
                <div className="notification-list">
                    {items.map((item) => (
                        <div className="notification" key={item.id}>
                            <div>
                                <h4>{item.message}</h4>
                                <p>
                                    {item.type} • {item.date}
                                </p>
                            </div>
                            <button
                                className="edit-action"
                                type="button"
                                title="Edit Notification"
                                onClick={() => edit(item)}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="delete-action"
                                type="button"
                                title="Delete Notification"
                                onClick={() => remove(item.id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default AdminNotifications;

