
import React, { useEffect, useState } from "react";
import { getData, addData, updateData, deleteData } from "../users/user";
import { FaEdit, FaTrash, FaCheck, FaDownload } from "react-icons/fa";
import "../styles/admin-bookings.css";

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

function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [vehicleFilter, setVehicleFilter] = useState("All");
    const [vipFilter, setVipFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [customer, setCustomer] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [vehicleType, setVehicleType] = useState("Car");
    const [service, setService] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("Pending");
    const [vipCustomer, setVipCustomer] = useState("No");

    const loadBookings = () => {
        getData("bookings")
            .then((data) => setBookings(data))
            .catch(() => setBookings([]));
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const saveBooking = (e) => {
        e.preventDefault();

        if (!customer || !vehicle || !service || !date) {
            alert("Please fill all fields.");
            return;
        }

        const oldBooking = bookings.find(
            (item) => String(item.id) === String(editId)
        );

        const data = {...(oldBooking || {}),customer: customer,vehicle: vehicle,vehicleType: vehicleType,service: service,repairMode: service,date: date,status: status,vipCustomer: vipCustomer};

        if (editId) {
            updateData("bookings", editId, data)
                .then(() => {
                    alert("Booking updated successfully.");
                    clearForm();
                    loadBookings();
                })
                .catch(() => alert("Unable to update booking."));
        } else {
            addData("bookings", data)
                .then(() => {
                    alert("Booking added successfully.");
                    clearForm();
                    loadBookings();
                })
                .catch(() => alert("Unable to add booking."));
        }
    };

    const editBooking = (item) => {
        setShowForm(true);
        setEditId(item.id);
        setCustomer(item.customer || "");
        setVehicle(item.vehicle || "");
        setVehicleType(item.vehicleType || "Car");
        setService(item.service || item.repairMode || "General Service");
        setDate(item.date || "");
        setStatus(item.status || "Pending");
        setVipCustomer(item.vipCustomer || "No");
    };

    const markCompleted = (item) => {
        updateData("bookings", item.id, {
            ...item,
            status: "Completed"
        })
            .then(() => {
                alert("Service completed. Booking status updated.");
                loadBookings();
            })
            .catch(() => alert("Unable to update booking status."));
    };

    const removeBooking = (id) => {
        if (!window.confirm("Delete this booking?")) {
            return;
        }

        deleteData("bookings", id)
            .then(() => {
                alert("Booking deleted.");
                loadBookings();
            })
            .catch(() => alert("Unable to delete booking."));
    };

    const exportBookings = () => {
        const text = bookings
            .map(
                (item) =>
                    `${item.id},${item.customer},${item.vehicle},${item.vehicleType},${item.service},${item.date},${item.status},${item.vipCustomer || "No"}`
            )
            .join("\n");

        const blob = new Blob(
            [
                "ID,Customer,Vehicle,Vehicle Type,Service,Date,Status,VIP Customer\n" +
                    text
            ],
            { type: "text/csv" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "bookings.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const clearForm = () => {
        setShowForm(false);
        setEditId(null);
        setCustomer("");
        setVehicle("");
        setVehicleType("Car");
        setService("");
        setDate("");
        setStatus("Pending");
        setVipCustomer("No");
    };

    const filtered = bookings.filter((item) => {
        const text = `${item.customer} ${item.vehicle} ${item.service}`.toLowerCase();

        return (
            (statusFilter === "All" || item.status === statusFilter) &&
            (vehicleFilter === "All" || item.vehicleType === vehicleFilter) &&
            (vipFilter === "All" || (item.vipCustomer || "No") === vipFilter) &&
            text.includes(search.toLowerCase())
        );
    });

    return (
        <>
            <PageHeader title="Bookings"subtitle="Manage all bookings in one place"action="Add Booking"onAction={() => {clearForm();setShowForm(true);}}/>
            <section className="panel admin-bookings-page">
                {showForm && (
                    <form className="user-form booking-admin-form"onSubmit={saveBooking}>
                        <label>
                            Customer
                            <input value={customer}onChange={(e) => setCustomer(e.target.value)}/>
                        </label>
                        <label>
                            Vehicle
                            <input value={vehicle}onChange={(e) => setVehicle(e.target.value)}  />
                        </label>
                        <label>
                            Vehicle Type
                            <select value={vehicleType}onChange={(e) => setVehicleType(e.target.value)}>
                                <option>Car</option>
                                <option>Bike</option>
                            </select>
                        </label>
                        <label>
                            Service / Repair Mode
                            <input value={service}onChange={(e) => setService(e.target.value)}placeholder="General Service"/>
                        </label>
                        <label>
                            Date
                            <input type="date"value={date}onChange={(e) => setDate(e.target.value)} />
                        </label>
                        <label>
                            VIP Customer
                            <select value={vipCustomer}onChange={(e) => setVipCustomer(e.target.value)}>
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </label>
                        <label>
                            Status
                            <select value={status}onChange={(e) => setStatus(e.target.value)}>
                                <option>Pending</option>
                                <option>Confirmed</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                            </select>
                        </label>
                        <div className="form-action-row">
                            <button className="primary-btn" type="submit">
                                {editId ? "Update Booking" : "Add Booking"}
                            </button>
                            <button className="cancel-btn"type="button"onClick={clearForm}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
                <div className="table-toolbar booking-filters">
                    <input placeholder="Search customer, vehicle or service"value={search}onChange={(e) => setSearch(e.target.value)}/>
                    <select value={statusFilter}onChange={(e) => setStatusFilter(e.target.value)}>
                        <option>All</option>
                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Cancelled</option>
                    </select>
                    <select value={vehicleFilter}onChange={(e) => setVehicleFilter(e.target.value)}>
                        <option>All</option>
                        <option>Car</option>
                        <option>Bike</option>
                    </select>
                    <select value={vipFilter} onChange={(e) => setVipFilter(e.target.value)}>
                        <option>All</option>
                        <option>Yes</option>
                        <option>No</option>
                    </select>
                    <button className="primary-btn"type="button"onClick={exportBookings}>
                        <FaDownload /> Export
                    </button>
                </div>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Vehicle</th>
                                <th>Type</th>
                                <th>Service</th>
                                <th>Date</th>
                                <th>VIP</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.vehicle}</td>
                                    <td>{item.vehicleType || "Car"}</td>
                                    <td>{item.service || item.repairMode}</td>
                                    <td>{item.date}</td>
                                    <td>{item.vipCustomer || "No"}</td>
                                    <td>{item.status}</td>
                                    <td className="action-buttons">
                                        <button className="edit-action"type="button"title="Edit Booking"onClick={() => editBooking(item)}>
                                            <FaEdit />
                                        </button>
                                        {item.status !== "Completed" &&
                                            item.status !== "Cancelled" && (
                                                <button className="complete-action"type="button"title="Mark Completed"onClick={() =>markCompleted(item)}>
                                                    <FaCheck />
                                                </button>
                                            )}
                                        <button className="delete-action"type="button"title="Delete Booking"onClick={() =>removeBooking(item.id) } >
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

export default AdminBookings

