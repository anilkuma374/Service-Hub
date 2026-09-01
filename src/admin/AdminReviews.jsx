
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/admin-reviews.css";

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

function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [customer, setCustomer] = useState("");
    const [center, setCenter] = useState("");
    const [rating, setRating] = useState("5");
    const [review, setReview] = useState("");
    const [status, setStatus] = useState("Visible");
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const load = () => {
        getData("reviews")
            .then((data) => setReviews(data))
            .catch(() => setReviews([]));
    };

    useEffect(() => {
        load();
    }, []);

    const save = (e) => {
        e.preventDefault();

        if (!customer || !review) {
            alert("Please fill all fields.");
            return;
        }

        const data = {
            customer: customer,
            center: center,
            rating: rating,
            review: review,
            status: status
        };

        if (editId) {
            updateData("reviews", editId, data)
                .then(() => {
                    alert("Review updated.");
                    clear();
                    load();
                })
                .catch(() => alert("Unable to update review."));
        } else {
            addData("reviews", data)
                .then(() => {
                    alert("Review added.");
                    clear();
                    load();
                })
                .catch(() => alert("Unable to add review."));
        }
    };

    const edit = (r) => {
        setShowForm(true);
        setCustomer(r.customer);
        setCenter(r.center);
        setRating(r.rating);
        setReview(r.review);
        setStatus(r.status);
        setEditId(r.id);
    };

    const remove = (id) => {
        if (!window.confirm("Delete this review?")) {
            return;
        }

        deleteData("reviews", id)
            .then(() => {
                alert("Review deleted.");
                load();
            })
            .catch(() => alert("Unable to delete review."));
    };

    const clear = () => {
        setShowForm(false);
        setCustomer("");
        setCenter("");
        setRating("5");
        setReview("");
        setStatus("Visible");
        setEditId(null);
    };

    return (
        <>
            <PageHeader
                title="Reviews"
                subtitle="Manage all reviews in one place"
                action="Add Review"
                onAction={() => {
                    clear();
                    setShowForm(true);
                }}
            />
            <section className="panel admin-reviews-page">
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
                            Service Center
                            <input
                                value={center}
                                onChange={(e) => setCenter(e.target.value)}
                            />
                        </label>
                        <label>
                            Rating
                            <select
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option>5</option>
                                <option>4</option>
                                <option>3</option>
                                <option>2</option>
                                <option>1</option>
                            </select>
                        </label>
                        <label>
                            Review
                            <input
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            />
                        </label>
                        <label>
                            Status
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option>Visible</option>
                                <option>Hidden</option>
                            </select>
                        </label>
                        <button type="submit">
                            {editId ? "Update Review" : "Add Review"}
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
                                <th>Customer</th>
                                <th>Center</th>
                                <th>Rating</th>
                                <th>Review</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.customer}</td>
                                    <td>{r.center}</td>
                                    <td>{r.rating}</td>
                                    <td>{r.review}</td>
                                    <td>{r.status}</td>
                                    <td>
                                        <button
                                            className="edit-action"
                                            type="button"
                                            title="Edit Review"
                                            onClick={() => edit(r)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="delete-action"
                                            type="button"
                                            title="Delete Review"
                                            onClick={() => remove(r.id)}
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

export default AdminReviews;

