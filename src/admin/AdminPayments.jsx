
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-payments.css";

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

function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [customer, setCustomer] = useState("");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("UPI");
    const [status, setStatus] = useState("Success");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const load = () => {
        getData("payments")
            .then((data) => setPayments(data))
            .catch(() => setPayments([]));
    };

    useEffect(() => {
        load();
    }, []);

    const save = (e) => {
        e.preventDefault();

        if (!customer || !amount) {
            alert("Please fill all fields.");
            return;
        }

        const data = {
            customer: customer,
            amount: amount,
            method: method,
            status: status
        };

        if (editId) {
            updateData("payments", editId, data)
                .then(() => {
                    alert("Payment updated.");
                    clear();
                    load();
                })
                .catch(() => alert("Unable to update payment."));
        } else {
            addData("payments", data)
                .then(() => {
                    alert("Payment added.");
                    clear();
                    load();
                })
                .catch(() => alert("Unable to add payment."));
        }
    };

    const edit = (p) => {
        setShowForm(true);
        setCustomer(p.customer);
        setAmount(p.amount);
        setMethod(p.method);
        setStatus(p.status);
        setEditId(p.id);
    };

    const remove = (id) => {
        if (!window.confirm("Delete this payment?")) {
            return;
        }

        deleteData("payments", id)
            .then(() => {
                alert("Payment deleted.");
                load();
            })
            .catch(() => alert("Unable to delete payment."));
    };

    const clear = () => {
        setShowForm(false);
        setCustomer("");
        setAmount("");
        setMethod("UPI");
        setStatus("Success");
        setEditId(null);
    };

    return (
        <>
            <PageHeader
                title="Payments"
                subtitle="Manage all payments in one place"
                action="Add Payment"
                onAction={() => {
                    clear();
                    setShowForm(true);
                }}
            />
            <section className="panel">
                {showForm && (
                    <form className="user-form" onSubmit={save}>
                        <label>
                            Customer
                            <input
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                            />
                        </label>
                        <label>
                            Amount
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </label>
                        <label>
                            Method
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            >
                                <option>UPI</option>
                                <option>Card</option>
                                <option>Cash</option>
                            </select>
                        </label>
                        <label>
                            Status
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option>Success</option>
                                <option>Pending</option>
                                <option>Failed</option>
                            </select>
                        </label>
                        <button type="submit">
                            {editId ? "Update Payment" : "Add Payment"}
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
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.customer}</td>
                                    <td>₹{p.amount}</td>
                                    <td>{p.method}</td>
                                    <td>{p.status}</td>
                                    <td>
                                        <button
                                            className="edit-action"
                                            type="button"
                                            title="Edit Payment"
                                            onClick={() => edit(p)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="delete-action"
                                            type="button"
                                            title="Delete Payment"
                                            onClick={() => remove(p.id)}
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

export default AdminPayments;
