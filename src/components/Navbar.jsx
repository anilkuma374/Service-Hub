import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { getCurrentUser, logoutUser } from "../users/user";
import "../styles/navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const user = getCurrentUser();

    const handleLogout = () => {
        logoutUser();
        alert("Logout successful.");
        navigate("/login");
    };

    return (
        <header className="navbar">
            <Link className="brand" to="/">
                Service<span>Hub</span>
            </Link>

            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/services">Services</NavLink>
                <NavLink to="/service-centers">Service Centers</NavLink>
                <NavLink to="/my-bookings">My Bookings</NavLink>
            </nav>

            <div className="nav-actions">
                {user ? (
                    <>
                        <Link to="/profile" className="login-link profile-link">
                            <FaUser /> {user.name}
                        </Link>
                        <button type="button" className="primary-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-link">Login</Link>
                        <Link to="/register" className="primary-btn">Get Started</Link>
                    </>
                )}
            </div>
        </header>
    );
}
