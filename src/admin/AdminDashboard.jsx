
import React, { useEffect, useState } from "react";
import { getData } from "../users/user";
import { FaUsers, FaCalendarCheck, FaBuilding, FaRupeeSign } from "react-icons/fa";
import "../styles/admin-dashboard.css";

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

const StatCard = ({ icon, title, value, change }) => {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div>
                <p>{title}</p>
                <h2>{value}</h2>
                <small>{change}</small>
            </div>
        </div>
    );
};

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

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [centers, setCenters] = useState([]);
    const [payments, setPayments] = useState([]);

    const loadDashboard = () => {
        getData("users")
            .then((data) => setUsers(data))
            .catch(() => setUsers([]));
        getData("bookings")
            .then((data) => setBookings(data))
            .catch(() => setBookings([]));
        getData("serviceCenters")
            .then((data) => setCenters(data))
            .catch(() => setCenters([]));
        getData("payments")
            .then((data) => setPayments(data))
            .catch(() => setPayments([]));
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const revenue = payments
        .filter((item) => item.status === "Success")
        .reduce((total, item) => total + Number(item.amount || 0), 0);

    const completedBookings = bookings.filter(
        (item) => item.status === "Completed"
    ).length;

    const pendingBookings = bookings.filter(
        (item) => item.status === "Pending"
    ).length;

    const confirmedBookings = bookings.filter(
        (item) => item.status === "Confirmed"
    ).length;

    const inProgressBookings = bookings.filter(
        (item) => item.status === "In Progress"
    ).length;

    const recentBookings = bookings
        .slice(-5)
        .reverse()
        .map((item) => [
            `#${item.id}`,
            item.customer,
            item.service,
            item.date,
            item.status
        ]);

    return (
        <>
            <PageHeader
                title="Dashboard"
                subtitle="Overview of your marketplace"
                action="Refresh"
                onAction={loadDashboard}
            />
            <div className="stats-grid">
                <StatCard
                    icon={<FaUsers />}
                    title="Total Users"
                    value={users.length}
                    change="Registered users"
                />
                <StatCard
                    icon={<FaCalendarCheck />}
                    title="Total Bookings"
                    value={bookings.length}
                    change="All bookings"
                />
                <StatCard
                    icon={<FaBuilding />}
                    title="Service Centers"
                    value={centers.length}
                    change="Available centers"
                />
                <StatCard
                    icon={<FaRupeeSign />}
                    title="Revenue"
                    value={`₹${revenue.toLocaleString()}`}
                    change="Successful payments"
                />
            </div>
            <div className="dashboard-grid">
                <section className="panel">
                    <h3>Revenue Overview</h3>
                    <div className="chart-placeholder">
                        <h4>Successful Revenue</h4>
                        <h2>₹{revenue.toLocaleString()}</h2>
                        <p>Revenue from successful payments</p>
                    </div>
                </section>
                <section className="panel">
                    <h3>Booking Analytics</h3>
                    <div className="chart-placeholder">
                        <p>
                            Pending: <strong>{pendingBookings}</strong>
                        </p>
                        <p>
                            Confirmed: <strong>{confirmedBookings}</strong>
                        </p>
                        <p>
                            In Progress: <strong>{inProgressBookings}</strong>
                        </p>
                        <p>
                            Completed: <strong>{completedBookings}</strong>
                        </p>
                    </div>
                </section>
            </div>
            <section className="panel">
                <h3>Recent Bookings</h3>
                <DataTable
                    columns={["ID", "Customer", "Service", "Date", "Status"]}
                    rows={recentBookings}
                />
            </section>
        </>
    );
}

export default AdminDashboard;

