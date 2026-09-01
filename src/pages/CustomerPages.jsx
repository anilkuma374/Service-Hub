import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser, getData, addData, updateData, deleteData } from "../users/user";
import "../styles/public.css";
import { FaEdit, FaTrash } from "react-icons/fa";



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
export function BookService() {
    const user = getCurrentUser();
    const [searchParams] = useSearchParams();
    const [vehicleType, setVehicleType] = useState(searchParams.get("type") === "bike" ? "Bike" : "Car");
    const [vehicleName, setVehicleName] = useState("");
    const [repairMode, setRepairMode] = useState(searchParams.get("service") || "General Service");
    const [center, setCenter] = useState(searchParams.get("center") || "");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [centers, setCenters] = useState([]);
    const [editBooking, setEditBooking] = useState(null);

    useEffect(() => {
        getData("serviceCenters")
            .then((data) => setCenters(data))
            .catch(() => setCenters([]));

        const editId = searchParams.get("edit");

        if (editId) {
            getData("bookings")
                .then((data) => {
                    const booking = data.find((item) => String(item.id) === String(editId));

                    if (booking) {
                        setEditBooking(booking);
                        setVehicleType(booking.vehicleType || "Car");
                        setVehicleName(booking.vehicle || "");
                        setRepairMode(booking.repairMode || booking.service || "General Service");
                        setCenter(booking.center || "");
                        setDate(booking.date || "");
                        setTime(booking.time || "");
                    }
                })
                .catch(() => alert("Unable to load booking."));
        }
    }, [searchParams]);

    const handleBook = (e) => {
        e.preventDefault();

        if (!vehicleName || !date || !time || !center) {
            alert("Please fill all booking details.");
            return;
        }

        const bookingData = {
            ...(editBooking || {}),
            customer: user.name,
            customerId: user.id,
            vehicle: vehicleName,
            vehicleType: vehicleType,
            repairMode: repairMode,
            service: repairMode,
            center: center,
            date: date,
            time: time,
            status: editBooking ? editBooking.status : "Pending",
            vipCustomer: editBooking ? (editBooking.vipCustomer || "No") : "No"
        };

        if (editBooking) {
            updateData("bookings", editBooking.id, bookingData)
                .then(() => {
                    alert("Booking updated successfully.");
                    setEditBooking(null);
                })
                .catch(() => alert("Unable to update booking."));
        } else {
            addData("bookings", bookingData)
                .then(() => {
                    alert("Booking confirmed successfully.");
                    setVehicleName("");
                    setDate("");
                    setTime("");
                })
                .catch(() => alert("Unable to create booking."));
        }
    };

    const carRepairModes = [
        "General Service",
        "Engine Repair",
        "Oil Change",
        "Brake Repair",
        "Battery Service",
        "Tyre Service",
        "AC Service"
    ];

    const bikeRepairModes = [
        "General Service",
        "Engine Repair",
        "Oil Change",
        "Brake Repair",
        "Chain Service",
        "Battery Service",
        "Tyre Service"
    ];

    return (
        <div className="container booking-form">
            <PageHeader title={editBooking ? "Edit Booking" : "Book a Service"} subtitle="Complete the details below" />

            <form onSubmit={handleBook}>
                <label>
                    Vehicle Type
                    <select value={vehicleType} onChange={(e) => { setVehicleType(e.target.value); setRepairMode("General Service"); }}>
                        <option>Car</option>
                        <option>Bike</option>
                    </select>
                </label>

                <label>
                    Vehicle Name
                    <input value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="Honda City / Royal Enfield" />
                </label>

                <label>
                    Repair / Service
                    <select value={repairMode} onChange={(e) => setRepairMode(e.target.value)}>
                        {(vehicleType === "Car" ? carRepairModes : bikeRepairModes).map((mode) => (
                            <option key={mode}>{mode}</option>
                        ))}
                    </select>
                </label>

                <label>
                    Service Center
                    <select value={center} onChange={(e) => setCenter(e.target.value)}>
                        <option value="">Select Service Center</option>
                        {centers.map((item) => (
                            <option key={item.id} value={item.name}>
                                {item.name} - {item.location}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Date
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>

                <label>
                    Time
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </label>

                <button className="primary-btn" type="submit">
                    {editBooking ? "Update Booking" : "Confirm Booking"}
                </button>
            </form>
        </div>
    );
}



export function MyVehicles() {
    const user = getCurrentUser();
    const [vehicles, setVehicles] = useState([]);
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [type, setType] = useState("Car");
    const [model, setModel] = useState("");
    const [editId, setEditId] = useState(null);

    const loadVehicles = () => {
        getData("vehicles")
            .then((data) => setVehicles(data.filter((item) => String(item.userId) === String(user.id))))
            .catch(() => setVehicles([]));
    };

    useEffect(() => {
        loadVehicles();
    }, []);

    const saveVehicle = (e) => {
        e.preventDefault();

        if (!name || !number || !model) {
            alert("Please fill all vehicle fields.");
            return;
        }

        const data = { userId: user.id, name: name, number: number, type: type, model: model };

        if (editId) {
            updateData("vehicles", editId, data)
                .then(() => {
                    alert("Vehicle updated successfully.");
                    clearForm();
                    loadVehicles();
                })
                .catch(() => alert("Unable to update vehicle."));
        } else {
            addData("vehicles", data)
                .then(() => {
                    alert("Vehicle added successfully.");
                    clearForm();
                    loadVehicles();
                })
                .catch(() => alert("Unable to add vehicle."));
        }
    };

    const editVehicle = (vehicle) => {
        setName(vehicle.name);
        setNumber(vehicle.number);
        setType(vehicle.type);
        setModel(vehicle.model);
        setEditId(vehicle.id);
    };

    const removeVehicle = (id) => {
        if (!window.confirm("Delete this vehicle?")) return;

        deleteData("vehicles", id)
            .then(() => {
                alert("Vehicle deleted successfully.");
                loadVehicles();
            })
            .catch(() => alert("Unable to delete vehicle."));
    };

    const clearForm = () => {
        setName("");
        setNumber("");
        setType("Car");
        setModel("");
        setEditId(null);
    };

    return (
        <div className="container">
            <PageHeader title="My Vehicles" subtitle="Add and manage your cars and bikes" />

            <form className="booking-form" onSubmit={saveVehicle}>
                <label>Vehicle Type<select value={type} onChange={(e) => setType(e.target.value)}><option>Car</option><option>Bike</option></select></label>
                <label>Vehicle Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Honda City / Royal Enfield" /></label>
                <label>Registration Number<input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="TS09 AB 1234" /></label>
                <label>Model Year<input value={model} onChange={(e) => setModel(e.target.value)} placeholder="2024" /></label>
                <button className="primary-btn" type="submit">{editId ? "Update Vehicle" : "Add Vehicle"}</button>
                {editId && <button type="button" onClick={clearForm}>Cancel</button>}
            </form>

            <div className="card-grid">
                {vehicles.map((vehicle) => (
                    <article className="service-card" key={vehicle.id}>
                        <img className="service-image" src={vehicle.type === "Car" ? carGeneral : bikeGeneral} alt={vehicle.type + " vehicle"} />
                        <h3>{vehicle.name}</h3>
                        <p>{vehicle.number}</p>
                        <p>{vehicle.type} • {vehicle.model}</p>
                        <button className="edit-booking-btn" type="button" onClick={() => editVehicle(vehicle)}>Edit</button>
                        <button className="cancel-booking-btn" type="button" onClick={() => removeVehicle(vehicle.id)}>Delete</button>
                    </article>
                ))}
            </div>
        </div>
    );
}

export function Profile() {
    const user = getCurrentUser();
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [mobile, setMobile] = useState(user.mobile || "");

    const saveProfile = (e) => {
        e.preventDefault();

        updateData("users", user.id, {
            ...user,
            name: name,
            email: email,
            mobile: mobile
        })
            .then((updated) => {
                localStorage.setItem("currentUser", JSON.stringify(updated));
                alert("Profile updated successfully.");
            })
            .catch(() => alert("Unable to update profile."));
    };

    return (
        <div className="container">
            <PageHeader title="My Profile" subtitle="Manage your personal information" />
            <form className="booking-form" onSubmit={saveProfile}>
                <label>Name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <label>Phone<input value={mobile} onChange={(e) => setMobile(e.target.value)} /></label>
                <button className="primary-btn" type="submit">Save Profile</button>
            </form>
        </div>
    );
}

export function CenterBookings() {
    const [bookings, setBookings] = useState([]);
    const load = () => getData("bookings").then(setBookings).catch(() => setBookings([]));
    useEffect(() => { load(); }, []);
    const updateStatus = (item) => { const next = item.status === "Pending" ? "Confirmed" : item.status === "Confirmed" ? "In Progress" : item.status === "In Progress" ? "Completed" : "Confirmed"; updateData("bookings", item.id, { ...item, status: next }).then(() => { alert("Booking updated."); load(); }).catch(() => alert("Unable to update booking.")); };
    const remove = (id) => { if (!window.confirm("Delete this booking?")) return; deleteData("bookings", id).then(() => { alert("Booking deleted."); load(); }).catch(() => alert("Unable to delete booking.")); };
    return (<><PageHeader title="Center Bookings" subtitle="Manage all center bookings in one place" /><section className="panel"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Customer</th><th>Vehicle</th><th>Service</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>{bookings.map((b) => <tr key={b.id}><td>{b.id}</td><td>{b.customer}</td><td>{b.vehicle}</td><td>{b.service}</td><td>{b.date}</td><td>{b.status}</td><td><button type="button" onClick={() => updateStatus(b)}><FaEdit /></button><button type="button" onClick={() => remove(b.id)}><FaTrash /></button></td></tr>)}</tbody></table></div></section></>);
}

export function CenterCustomers() {
    const [customers, setCustomers] = useState([]);
    const load = () => getData("users").then((data) => setCustomers(data.filter((u) => u.role === "user"))).catch(() => setCustomers([]));
    useEffect(() => { load(); }, []);
    const exportCustomers = () => { const text = customers.map((c) => `${c.name},${c.email},${c.mobile}`).join("\n"); const blob = new Blob(["Name,Email,Mobile\n" + text], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click(); URL.revokeObjectURL(url); };
    return (<><PageHeader title="Customers" subtitle="Manage all customers in one place" action="Export" onAction={exportCustomers} /><section className="panel"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Mobile</th></tr></thead><tbody>{customers.map((c) => <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.mobile}</td></tr>)}</tbody></table></div></section></>);
}

const DataTable = ({ columns, rows }) => {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {rows.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>No data found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export function CenterDashboard() {

    const exportReport = () => {
        const text = "Metric,Value\nToday's Bookings,18\nCompleted,12\nPending,4\nRevenue,₹24,500";
        const blob = new Blob([text], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "center-report.csv";
        link.click();
        URL.revokeObjectURL(url);
        alert("Report exported successfully.");
    };

    const rows = [
        ["Today's Bookings", "18"],
        ["Completed", "12"],
        ["Pending", "4"],
        ["Revenue", "₹24,500"]
    ];

    return (
        <>
            <PageHeader
                title="Service Center Dashboard"
                subtitle="Manage all service center dashboard in one place"
                action="Export"
                onAction={exportReport}
            />

            <section className="panel">

                <div className="table-toolbar">
                    <input placeholder="Search..." />
                    <select>
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Pending</option>
                    </select>
                </div>

                <DataTable
                    columns={["Metric", "Value"]}
                    rows={rows}
                />

            </section>
        </>
    );
}

export function CenterEarnings() {
    const [bookings, setBookings] = useState([]); const load = () => getData("bookings").then(setBookings).catch(() => setBookings([])); useEffect(() => { load(); }, []);
    const exportData = () => { const text = bookings.map((b) => `${b.id},${b.customer},${b.service},${b.status}`).join("\n"); const blob = new Blob(["ID,Customer,Service,Status\n" + text], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "earnings.csv"; a.click(); URL.revokeObjectURL(url); };
    return (<><PageHeader title="Earnings" subtitle="View earnings from completed bookings" action="Export" onAction={exportData} /><section className="panel"><h3>Total Bookings: {bookings.length}</h3><p>Completed Bookings: {bookings.filter((b) => b.status === "Completed").length}</p><button type="button" onClick={load}>Refresh</button></section></>);
}

export function CenterReviews() {
    const [reviews, setReviews] = useState([]); const load = () => getData("reviews").then(setReviews).catch(() => setReviews([])); useEffect(() => { load(); }, []);
    const remove = (id) => { if (!window.confirm("Delete this review?")) return; deleteData("reviews", id).then(() => { alert("Review deleted."); load(); }).catch(() => alert("Unable to delete review.")); };
    return (<><PageHeader title="Reviews" subtitle="Manage all reviews in one place" action="Refresh" onAction={load} /><section className="panel"><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Rating</th><th>Review</th><th>Action</th></tr></thead><tbody>{reviews.map((r) => <tr key={r.id}><td>{r.customer}</td><td>⭐ {r.rating}</td><td>{r.review}</td><td><button type="button" onClick={() => remove(r.id)}><FaTrash /></button></td></tr>)}</tbody></table></div></section></>);
}

export function CenterServices() {
    const [services, setServices] = useState([]); const [name, setName] = useState(""); const [price, setPrice] = useState(""); const [duration, setDuration] = useState(""); const [type, setType] = useState("Car"); const [repairMode, setRepairMode] = useState("General Service"); const [editId, setEditId] = useState(null);
    const load = () => getData("services").then(setServices).catch(() => setServices([])); useEffect(() => { load(); }, []);
    const save = (e) => { e.preventDefault(); if (!name || !price || !duration) { alert("Please fill all fields."); return; } const data = { name, price, duration, vehicleType: type, repairMode, status: "Active" }; if (editId) updateData("services", editId, data).then(() => { alert("Service updated."); clear(); load(); }).catch(() => alert("Unable to update service.")); else addData("services", data).then(() => { alert("Service added."); clear(); load(); }).catch(() => alert("Unable to add service.")); };
    const edit = (s) => { setName(s.name); setPrice(s.price); setDuration(s.duration); setType(s.vehicleType || "Car"); setRepairMode(s.repairMode || "General Service"); setEditId(s.id); }; const remove = (id) => { if (!window.confirm("Delete this service?")) return; deleteData("services", id).then(() => { alert("Service deleted."); load(); }).catch(() => alert("Unable to delete service.")); }; const clear = () => { setName(""); setPrice(""); setDuration(""); setType("Car"); setRepairMode("General Service"); setEditId(null); };
    return (<><PageHeader title="My Services" subtitle="Manage all my services in one place" /><section className="panel"><form className="user-form" onSubmit={save}><label>Service<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Vehicle Type<select value={type} onChange={(e) => setType(e.target.value)}><option>Car</option><option>Bike</option></select></label><label>Repair Mode<select value={repairMode} onChange={(e) => setRepairMode(e.target.value)}><option>General Service</option><option>Engine Repair</option><option>Oil Change</option><option>Brake Repair</option><option>Battery Service</option><option>Tyre Service</option><option>AC Service</option><option>Chain Service</option></select></label><label>Price<input value={price} onChange={(e) => setPrice(e.target.value)} /></label><label>Duration<input value={duration} onChange={(e) => setDuration(e.target.value)} /></label><button type="submit">{editId ? "Update" : "Add"}</button>{editId && <button type="button" onClick={clear}>Cancel</button>}</form><div className="table-wrap"><table><thead><tr><th>Service</th><th>Vehicle</th><th>Repair Mode</th><th>Price</th><th>Duration</th><th>Action</th></tr></thead><tbody>{services.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.vehicleType}</td><td>{s.repairMode}</td><td>₹{s.price}</td><td>{s.duration}</td><td><button type="button" onClick={() => edit(s)}><FaEdit /></button><button type="button" onClick={() => remove(s.id)}><FaTrash /></button></td></tr>)}</tbody></table></div></section></>);
}

export function CenterSettings() {
    const [center, setCenter] = useState(null); const [name, setName] = useState(""); const [location, setLocation] = useState(""); const [phone, setPhone] = useState("");
    const load = () => getData("serviceCenters").then((data) => { const item = data[0]; setCenter(item); if (item) { setName(item.name); setLocation(item.location); setPhone(item.phone); } }).catch(() => {}); useEffect(() => { load(); }, []);
    const save = (e) => { e.preventDefault(); if (!center) { alert("Add a service center from Admin first."); return; } updateData("serviceCenters", center.id, { ...center, name, location, phone }).then(() => { alert("Center settings saved."); load(); }).catch(() => alert("Unable to save settings.")); };
    return (<><PageHeader title="Center Settings" subtitle="Manage center information" /><section className="panel settings-grid"><form onSubmit={save}><label>Center Name<input value={name} onChange={(e) => setName(e.target.value)} /></label><label>Location<input value={location} onChange={(e) => setLocation(e.target.value)} /></label><label>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} /></label><button className="primary-btn" type="submit">Save Settings</button><button type="button" onClick={load}>Refresh</button></form></section></>);
}
