import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../users/user";
import "../styles/login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            alert("Please enter email and password.");
            return;
        }

        loginUser(email, password)
            .then((result) => {
                if (!result.success) {
                    alert(result.message);
                    return;
                }

                alert("Login successful.");

                if (result.user.role === "admin") {
                    navigate("/admin/dashboard");
                } else if (result.user.role === "center") {
                    navigate("/center/dashboard");
                } else {
                    navigate("/");
                }
            })
            .catch(() => {
                alert("Login failed. Please try again.");
            });
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleLogin} noValidate>
                <h1>Login</h1>
                <p>Login to ServiceHub</p>

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>

                <p className="auth-link">
                    New user? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
