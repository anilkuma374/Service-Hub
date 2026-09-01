import React from "react";
import { Routes, Route, Navigate, Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../users/user";
import Home from "../components/Home";
import Login from "../pages/Login";
import Reg from "../pages/Reg";
import { BookService, MyVehicles, Profile, CenterDashboard, CenterBookings, CenterServices, CenterCustomers, CenterEarnings, CenterReviews, CenterSettings } from "../pages/CustomerPages";
import Services from "../components/Services";
import ServiceCenters from "../components/ServiceCenters";
import MyBookings from "../components/MyBookings";
import Navbar from "../components/Navbar";
import AdminDashboard from "../admin/AdminDashboard";
import AdminUsers from "../admin/AdminUsers";
import AdminCenters from "../admin/AdminCenters";
import AdminServices from "../admin/AdminServices";
import AdminBookings from "../admin/AdminBookings";
import AdminVehicles from "../admin/AdminVehicles";
import AdminPayments from "../admin/AdminPayments";
import AdminReviews from "../admin/AdminReviews";
import AdminNotifications from "../admin/AdminNotifications";
import AdminSettings from "../admin/AdminSettings";
import { FaUser, FaBell, FaChartPie, FaUsers, FaBuilding, FaTools, FaCalendarCheck, FaWrench, FaCreditCard, FaStar, FaCog, FaWallet } from "react-icons/fa";
import "../styles/footer.css";



const Footer = () => {
    return (
        <footer className="footer">
            <div>
                <h2>Service<span>Hub</span></h2>
                <p>Easy, trusted and professional vehicle service.</p>
            </div>

            <div>
                <h4>Quick Links</h4>
                <Link to="/services">Services</Link>
                <Link to="/service-centers">Service Centers</Link>
                <Link to="/my-bookings">My Bookings</Link>
            </div>

            <div>
                <h4>Contact</h4>
                <p>support@servicehub.com</p>
                <p>+91 98765 43210</p>
            </div>
        </footer>
    );
};

const adminItems = [
    ["/admin/dashboard", "Dashboard", FaChartPie],
    ["/admin/users", "Users", FaUsers],
    ["/admin/service-centers", "Service Centers", FaBuilding],
    ["/admin/services", "Services", FaTools],
    ["/admin/bookings", "Bookings", FaCalendarCheck],
    ["/admin/vehicles", "Vehicles", FaWrench],
    ["/admin/payments", "Payments", FaCreditCard],
    ["/admin/reviews", "Reviews", FaStar],
    ["/admin/notifications", "Notifications", FaBell],
    ["/admin/settings", "Settings", FaCog]
];

const centerItems = [
    ["/center/dashboard", "Dashboard", FaChartPie],
    ["/center/bookings", "Bookings", FaCalendarCheck],
    ["/center/services", "Services", FaTools],
    ["/center/customers", "Customers", FaUsers],
    ["/center/earnings", "Earnings", FaWallet],
    ["/center/reviews", "Reviews", FaStar],
    ["/center/settings", "Settings", FaCog]
];

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="admin-brand">
                SERVICE<span>HUB</span>
                <small>ADMIN PANEL</small>
            </div>
            <nav>
                {adminItems.map(([path, label, Icon]) => (
                    <NavLink key={path} to={path}>
                        <Icon />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

const CenterSidebar = () => {
    return (
        <aside className="admin-sidebar center-sidebar">
            <div className="admin-brand">
                SERVICE<span>HUB</span>
                <small>CENTER PANEL</small>
            </div>
            <nav>
                {centerItems.map(([path, label, Icon]) => (
                    <NavLink key={path} to={path}>
                        <Icon />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

const AdminNavbar = () => {
    const navigate = useNavigate();
    const admin = getCurrentUser();
    const adminName = admin?.name || admin?.fullName || admin?.username || "Admin";

    const handleLogout = () => {
        logoutUser();
        alert("Logout successful.");
        navigate("/login");
    };

    return (
        <header className="admin-navbar">
            <div className="admin-welcome">
                <h3>Welcome back, {adminName} 👋</h3>
                <p>Manage your ServiceHub marketplace</p>
            </div>
            <div className="admin-actions">
                <Link to="/admin/notifications" className="admin-icon-btn" title="Notifications">
                    <FaBell />
                </Link>
                <Link to="/admin/settings" className="admin-profile" title="Admin Profile">
                    <div className="admin-avatar">
                        <FaUser />
                    </div>
                    <span>{adminName}</span>
                </Link>
                <button type="button" className="admin-logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

const MainLayout = () => {
    return (
        <>
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <section className="admin-main">
                <AdminNavbar />
                <main className="admin-page">
                    <Outlet />
                </main>
            </section>
        </div>
    );
};

const CenterLayout = () => {
    return (
        <div className="admin-layout">
            <CenterSidebar />
            <section className="admin-main">
                <AdminNavbar />
                <main className="admin-page">
                    <Outlet />
                </main>
            </section>
        </div>
    );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const user = getCurrentUser();

    if (user === null) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (adminOnly === true && user.role !== "admin") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
};
const AllRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/service-centers" element={<ServiceCenters />} />
                <Route path="/book-service" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
                <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                <Route path="/my-vehicles" element={<ProtectedRoute><MyVehicles /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Reg />} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="service-centers" element={<AdminCenters />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="vehicles" element={<AdminVehicles />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="/center" element={<ProtectedRoute><CenterLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<CenterDashboard />} />
                <Route path="bookings" element={<CenterBookings />} />
                <Route path="services" element={<CenterServices />} />
                <Route path="customers" element={<CenterCustomers />} />
                <Route path="earnings" element={<CenterEarnings />} />
                <Route path="reviews" element={<CenterReviews />} />
                <Route path="settings" element={<CenterSettings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AllRoutes;
